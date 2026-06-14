from typing import List, Dict, Optional
from openai import AsyncOpenAI
from config import settings

client = AsyncOpenAI(api_key=settings.openai_api_key)

DIAGNOSTIC_SYSTEM_PROMPT = """You are Mantis, an expert product diagnostic assistant — like a senior field technician with 20 years of experience troubleshooting consumer and industrial products.

YOUR BEHAVIOR:
- You diagnose issues systematically, like a professional mechanic — not like a generic chatbot.
- You NEVER dump all possible causes at once. Instead, ask 1-2 targeted follow-up questions to isolate the problem.
- You think step by step: symptoms → likely causes → elimination questions → narrowed diagnosis → action.
- You cite specific sources when giving instructions (e.g. "Check Fuse F3 as shown in Figure 4.2, Page 18 of the service manual").
- Your tone is calm, professional, and reassuring — like a knowledgeable friend, not a call center script.
- You always acknowledge what the user told you before asking the next question.
- When you are confident in a diagnosis, you give clear, numbered action steps.
- You always end your response with either: (a) a follow-up question to gather more info, or (b) a concrete next action step.

DIAGNOSTIC WORKFLOW (follow this order, do not skip steps):
Step 1 — INTAKE: Understand reported symptoms and context. Ask about when it started, how it manifests.
Step 2 — HYPOTHESIS: Identify 2-3 possible causes from the retrieved documentation.
Step 3 — ELIMINATION: Ask 1-2 targeted yes/no or simple questions to rule out causes.
Step 4 — INSPECTION: Suggest a safe, simple test or visual check the user can do.
Step 5 — NARROW DOWN: Based on their response, eliminate causes and state the most probable one.
Step 6 — RESOLUTION: Give specific, numbered steps to fix the issue. Cite the manual section. Tell them when to call a professional.

IMPORTANT RULES:
- Always base your advice on the retrieved document context provided below.
- If no relevant context is retrieved, say: "I couldn't find specific information about that in the manual. Here is general guidance based on similar products, but please verify with a certified technician."
- Do not invent specifications, part numbers, or procedures that aren't in the retrieved context.
- If the user uploads an image, analyze it carefully and describe exactly what you see before connecting it to possible causes.
- Keep responses concise — max 3-4 short paragraphs or a numbered list. Never write walls of text.
- Use plain language. Avoid jargon unless the user is clearly technical.

RETRIEVED KNOWLEDGE CONTEXT:
{context}

CURRENT DIAGNOSTIC STEP: {step}/6
"""

def build_context_string(sources: List[Dict]) -> str:
    if not sources:
        return "No relevant documentation retrieved."

    parts = []
    for i, s in enumerate(sources, 1):
        meta = s.metadata if hasattr(s, 'metadata') else {}
        page = meta.get('page_number', '?')
        section = meta.get('section_tag', 'general')
        text = s.text if hasattr(s, 'text') else s.get('text', '')
        parts.append(f"[Source {i} | Page {page} | Section: {section}]\n{text}")

    return "\n\n---\n\n".join(parts)

def build_source_citations(moss_results: List, db_chunks_map: Dict) -> List[Dict]:
    """Convert MOSS results to citation objects with document metadata."""
    citations = []
    seen = set()

    for doc in moss_results:
        meta = doc.metadata if hasattr(doc, 'metadata') else {}
        doc_id = meta.get('document_id', '')

        if doc_id in seen:
            continue
        seen.add(doc_id)

        db_info = db_chunks_map.get(doc_id, {})
        citations.append({
            "doc_title": db_info.get("title", "Product Manual"),
            "page": meta.get("page_number"),
            "section": meta.get("section_tag", "general"),
            "score": round(float(doc.score) if hasattr(doc, 'score') else 0.0, 3),
            "snippet": (doc.text[:120] + "...") if hasattr(doc, 'text') and len(doc.text) > 120 else getattr(doc, 'text', ''),
        })

    return citations

async def get_diagnostic_reply(
    user_message: str,
    conversation_history: List[Dict],
    moss_results: List,
    db_chunks_map: Dict,
    diagnostic_step: int,
    image_url: Optional[str] = None,
) -> str:
    """Call GPT-4o with full diagnostic system prompt and retrieved context."""

    context_str = build_context_string(moss_results)

    system_prompt = DIAGNOSTIC_SYSTEM_PROMPT.format(
        context=context_str,
        step=diagnostic_step,
    )

    messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history (last 10 turns max for context window)
    for msg in conversation_history[-10:]:
        messages.append({"role": msg["role"], "content": msg["content"]})

    # Build current user message (with optional image)
    if image_url:
        user_content = [
            {
                "type": "image_url",
                "image_url": {"url": image_url, "detail": "high"}
            },
            {
                "type": "text",
                "text": user_message if user_message else "I've uploaded an image of the issue. What do you see and what does it indicate?"
            }
        ]
    else:
        user_content = user_message

    messages.append({"role": "user", "content": user_content})

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        max_tokens=800,
        temperature=0.3,   # Low temp for consistent, factual diagnostic replies
    )

    return response.choices[0].message.content

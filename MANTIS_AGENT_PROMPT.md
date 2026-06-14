# MANTIS — AI AGENT BUILD PROMPT
## Complete, Exhaustive Specification for a Production-Grade Product Diagnostic Platform

> You are a senior full-stack engineer. Build the entire Mantis platform exactly as specified below.
> Do not skip any section. Do not simplify. Do not ask for clarification — every decision is made for you.
> Follow the tech stack, file structure, naming conventions, design system, and logic precisely.

---

## 0. WHAT YOU ARE BUILDING

**Mantis** is an AI-powered product support platform where:
- **Companies** register, list their products, and upload support materials (PDFs, docs, images, links).
- **Users** browse products and interact with an intelligent diagnostic assistant per product.
- The assistant behaves like a **mechanic / support engineer** — it asks targeted follow-up questions, narrows down root causes, and cites specific sections from the uploaded manual.
- Users can troubleshoot via **text**, **voice** (speak their problem), and **image** (upload a photo of the broken component).
- Retrieval is powered by **MOSS** (`@moss-dev/moss`) — a sub-10ms semantic + keyword hybrid search engine.
- The design is dark, bold, minimal, and premium — inspired by academy.mercdev.com: deep black backgrounds, large headings, clean card layouts, generous whitespace, one strong accent color.

---

## 1. TECH STACK — EXACT VERSIONS

### Frontend
```
Framework:       Next.js 14.2+ (App Router, TypeScript)
Styling:         Tailwind CSS 3.4+ with custom design tokens
Animations:      Framer Motion 11+
Icons:           Lucide React 0.383+
Forms:           React Hook Form 7+ with Zod validation
HTTP Client:     Axios 1.7+ (for API calls to backend)
State:           Zustand 4+ (global), React Query / TanStack Query 5+ (server state)
File Upload:     react-dropzone 14+
Audio:           Web Speech API (built-in browser STT) + ElevenLabs TTS via REST
Markdown:        react-markdown 9+ (for rendering assistant responses)
Toasts:          sonner 1+
```

### Backend
```
Framework:       FastAPI 0.111+ (Python 3.11+)
ASGI Server:     Uvicorn 0.30+
Auth:            Supabase Auth (via supabase-py 2+)
Database:        Supabase (PostgreSQL 15) via supabase-py
File Storage:    Supabase Storage
MOSS:            moss 0.4+ (pip install moss) — Python SDK
PDF Parsing:     pdfplumber 0.11+ (extract text + page numbers from PDFs)
AI:              openai 1.30+ (GPT-4o for chat + vision, Whisper for audio STT)
Background jobs: FastAPI BackgroundTasks (for indexing after upload)
CORS:            fastapi.middleware.cors
Env:             python-dotenv 1+
Validation:      pydantic 2+
```

### Infrastructure
```
Auth + DB + Storage:   Supabase (free tier is sufficient)
MOSS Cloud:            moss.dev (free tier — sign up at moss.dev for project_id and project_key)
AI:                    OpenAI API key (GPT-4o + Whisper)
TTS:                   ElevenLabs API key (free tier)
Deployment:            Vercel (frontend) + Railway or Render (backend)
```

---

## 2. ENVIRONMENT VARIABLES

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (`backend/.env`)
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
MOSS_PROJECT_ID=your_moss_project_id
MOSS_PROJECT_KEY=your_moss_project_key
FRONTEND_URL=http://localhost:3000
```

---

## 3. EXACT DIRECTORY STRUCTURE

```
mantis/
├── frontend/                          # Next.js 14 App Router
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with Navbar + Providers
│   │   ├── page.tsx                   # Landing page (/)
│   │   ├── globals.css                # Global CSS + Tailwind directives
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx               # Product marketplace (/products)
│   │   │   └── [id]/
│   │   │       ├── page.tsx           # Product detail (/products/[id])
│   │   │       └── assistant/
│   │   │           └── page.tsx       # Diagnostic assistant (/products/[id]/assistant)
│   │   └── dashboard/
│   │       ├── layout.tsx             # Dashboard sidebar layout
│   │       ├── page.tsx               # Company dashboard home
│   │       ├── products/
│   │       │   ├── page.tsx           # List company products
│   │       │   ├── new/page.tsx       # Create product
│   │       │   └── [id]/
│   │       │       ├── edit/page.tsx  # Edit product
│   │       │       └── knowledge/page.tsx  # Upload knowledge base
│   │       └── settings/page.tsx      # Company settings
│   ├── components/
│   │   ├── ui/                        # Reusable primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── Tooltip.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── DashboardSidebar.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductSearchBar.tsx
│   │   │   └── CategoryFilter.tsx
│   │   ├── assistant/
│   │   │   ├── AssistantChat.tsx      # Main chat container
│   │   │   ├── MessageBubble.tsx      # Single message with citations
│   │   │   ├── InputBar.tsx           # Text + voice + image input bar
│   │   │   ├── VoiceButton.tsx        # Mic button with recording state
│   │   │   ├── ImageUploadButton.tsx  # Camera/upload button
│   │   │   ├── SourceCitation.tsx     # Clickable source pill
│   │   │   ├── DiagnosticProgress.tsx # 6-step progress indicator
│   │   │   └── RetrievalBadge.tsx     # "Retrieved in Xms via MOSS"
│   │   └── dashboard/
│   │       ├── KnowledgeUploader.tsx
│   │       ├── DocumentList.tsx
│   │       └── ProductForm.tsx
│   ├── lib/
│   │   ├── api.ts                     # Axios instance + typed API calls
│   │   ├── supabase.ts                # Supabase client
│   │   ├── auth.ts                    # Auth helpers
│   │   └── utils.ts                   # cn(), formatDate(), etc.
│   ├── stores/
│   │   ├── authStore.ts               # Zustand: user, role, company
│   │   └── chatStore.ts               # Zustand: messages, voice state, image
│   ├── types/
│   │   └── index.ts                   # All TypeScript interfaces
│   ├── hooks/
│   │   ├── useVoiceInput.ts           # Web Speech API hook
│   │   ├── useTextToSpeech.ts         # ElevenLabs TTS hook
│   │   └── useProducts.ts             # TanStack Query hooks
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── package.json
│
└── backend/                           # FastAPI Python
    ├── main.py                        # App entry point, CORS, router include
    ├── config.py                      # Settings from env
    ├── database.py                    # Supabase client singleton
    ├── moss_client.py                 # MOSS client singleton + helpers
    ├── routers/
    │   ├── auth.py                    # /auth/* endpoints
    │   ├── products.py                # /products/* endpoints
    │   ├── knowledge.py               # /knowledge/* endpoints
    │   ├── assistant.py               # /assistant/* endpoint (SSE streaming)
    │   ├── voice.py                   # /voice/transcribe endpoint
    │   └── image.py                   # /image/analyze endpoint
    ├── services/
    │   ├── pdf_service.py             # PDF extraction + chunking
    │   ├── moss_service.py            # Index creation, querying, management
    │   ├── assistant_service.py       # Diagnostic prompt builder + LLM call
    │   ├── voice_service.py           # Whisper transcription
    │   └── image_service.py           # GPT-4o vision analysis
    ├── models/
    │   └── schemas.py                 # Pydantic request/response schemas
    └── requirements.txt
```

---

## 4. DATABASE SCHEMA (Supabase / PostgreSQL)

Run these SQL statements in Supabase SQL Editor in order.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- COMPANIES
-- ─────────────────────────────────────────────
CREATE TABLE companies (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  logo_url      TEXT,
  website_url   TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  model_number    TEXT,
  category        TEXT NOT NULL,  -- 'scooter'|'ac'|'washing_machine'|'electronics'|'appliance'|'other'
  description     TEXT NOT NULL,
  image_url       TEXT,
  is_published    BOOLEAN DEFAULT false,
  moss_index_id   TEXT,           -- MOSS index name: "product-{id}"
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- KNOWLEDGE DOCUMENTS (per product)
-- ─────────────────────────────────────────────
CREATE TABLE knowledge_documents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  type            TEXT NOT NULL,  -- 'pdf'|'text'|'link'|'video_link'
  file_url        TEXT,           -- Supabase Storage URL (for uploaded files)
  external_url    TEXT,           -- for links/YouTube
  page_count      INTEGER,
  chunk_count     INTEGER DEFAULT 0,
  indexed         BOOLEAN DEFAULT false,
  indexing_error  TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- DOCUMENT CHUNKS (stored after PDF parsing)
-- ─────────────────────────────────────────────
CREATE TABLE document_chunks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id     UUID NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  chunk_index     INTEGER NOT NULL,
  content         TEXT NOT NULL,
  page_number     INTEGER,
  section_tag     TEXT,           -- 'troubleshooting'|'maintenance'|'specifications'|'parts'|'safety'|'general'
  char_count      INTEGER,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- DIAGNOSTIC SESSIONS
-- ─────────────────────────────────────────────
CREATE TABLE diagnostic_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_token   TEXT UNIQUE NOT NULL,   -- random token for anonymous sessions
  status          TEXT DEFAULT 'active',  -- 'active'|'resolved'|'abandoned'
  diagnostic_step INTEGER DEFAULT 1,      -- 1-6 (maps to 6-step workflow)
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- CHAT MESSAGES
-- ─────────────────────────────────────────────
CREATE TABLE chat_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id      UUID NOT NULL REFERENCES diagnostic_sessions(id) ON DELETE CASCADE,
  role            TEXT NOT NULL,        -- 'user'|'assistant'
  content         TEXT NOT NULL,
  input_type      TEXT DEFAULT 'text',  -- 'text'|'voice'|'image'
  image_url       TEXT,                 -- if input_type='image'
  sources         JSONB,                -- [{doc_title, page, section, score, snippet}]
  retrieval_ms    INTEGER,              -- how long MOSS took
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- RLS POLICIES
-- ─────────────────────────────────────────────
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Companies: only owner can write
CREATE POLICY "companies_select_all" ON companies FOR SELECT USING (true);
CREATE POLICY "companies_insert_own" ON companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "companies_update_own" ON companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "companies_delete_own" ON companies FOR DELETE USING (auth.uid() = user_id);

-- Products: public read, company owner write
CREATE POLICY "products_select_published" ON products FOR SELECT USING (is_published = true OR company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));
CREATE POLICY "products_insert_own" ON products FOR INSERT WITH CHECK (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));
CREATE POLICY "products_update_own" ON products FOR UPDATE USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));
CREATE POLICY "products_delete_own" ON products FOR DELETE USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

-- Knowledge docs: public read, company owner write
CREATE POLICY "docs_select_all" ON knowledge_documents FOR SELECT USING (true);
CREATE POLICY "docs_insert_own" ON knowledge_documents FOR INSERT WITH CHECK (product_id IN (SELECT id FROM products WHERE company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())));
CREATE POLICY "docs_delete_own" ON knowledge_documents FOR DELETE USING (product_id IN (SELECT id FROM products WHERE company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())));

-- Chunks: public read (backend uses service role for writes)
CREATE POLICY "chunks_select_all" ON document_chunks FOR SELECT USING (true);

-- Sessions: public insert/read own
CREATE POLICY "sessions_select_all" ON diagnostic_sessions FOR SELECT USING (true);
CREATE POLICY "sessions_insert_all" ON diagnostic_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "sessions_update_all" ON diagnostic_sessions FOR UPDATE USING (true);

-- Messages: public
CREATE POLICY "messages_select_all" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "messages_insert_all" ON chat_messages FOR INSERT WITH CHECK (true);
```

---

## 5. BACKEND — COMPLETE IMPLEMENTATION

### `backend/requirements.txt`
```
fastapi==0.111.0
uvicorn[standard]==0.30.1
supabase==2.5.0
openai==1.35.0
pdfplumber==0.11.2
moss==0.4.0
python-dotenv==1.0.1
python-multipart==0.0.9
pydantic==2.7.4
httpx==0.27.0
```

---

### `backend/config.py`
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    supabase_url: str
    supabase_service_role_key: str
    openai_api_key: str
    elevenlabs_api_key: str
    elevenlabs_voice_id: str = "21m00Tcm4TlvDq8ikWAM"
    moss_project_id: str
    moss_project_key: str
    frontend_url: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

settings = Settings()
```

---

### `backend/database.py`
```python
from supabase import create_client, Client
from config import settings

def get_supabase() -> Client:
    return create_client(settings.supabase_url, settings.supabase_service_role_key)

supabase: Client = get_supabase()
```

---

### `backend/moss_client.py`
```python
import asyncio
from moss import MossClient
from config import settings

_moss_client: MossClient | None = None

def get_moss() -> MossClient:
    global _moss_client
    if _moss_client is None:
        _moss_client = MossClient(settings.moss_project_id, settings.moss_project_key)
    return _moss_client
```

---

### `backend/models/schemas.py`
```python
from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Any
from enum import Enum

class UserRole(str, Enum):
    COMPANY = "company"
    USER = "user"

class RegisterRequest(BaseModel):
    email: str
    password: str
    role: UserRole
    company_name: Optional[str] = None  # required if role == company

class LoginRequest(BaseModel):
    email: str
    password: str

class ProductCreate(BaseModel):
    name: str
    model_number: Optional[str] = None
    category: str
    description: str
    image_url: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    model_number: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_published: Optional[bool] = None

class DocumentLinkCreate(BaseModel):
    title: str
    type: str   # 'link' | 'video_link'
    external_url: str

class ChatRequest(BaseModel):
    session_token: str
    product_id: str
    message: str
    input_type: str = "text"   # 'text' | 'voice' | 'image'
    image_url: Optional[str] = None
    conversation_history: List[dict] = []

class SourceCitation(BaseModel):
    doc_title: str
    page: Optional[int]
    section: Optional[str]
    score: float
    snippet: str

class ChatResponse(BaseModel):
    reply: str
    sources: List[SourceCitation]
    retrieval_ms: int
    diagnostic_step: int
    session_token: str
```

---

### `backend/services/pdf_service.py`
```python
import pdfplumber
import re
from typing import List, Dict

CHUNK_SIZE = 600        # characters per chunk
CHUNK_OVERLAP = 100     # overlap between chunks

SECTION_KEYWORDS = {
    "troubleshooting": ["troubleshoot", "problem", "issue", "fault", "error", "not working", "repair", "fix", "diagnos"],
    "maintenance": ["maintenance", "service", "clean", "replace", "interval", "schedule", "oil", "filter", "check"],
    "specifications": ["specification", "dimension", "capacity", "weight", "voltage", "power", "model", "rated"],
    "parts": ["part", "component", "spare", "assembly", "diagram", "exploded", "catalog", "item number"],
    "safety": ["warning", "caution", "danger", "safety", "hazard", "do not", "never"],
}

def classify_section(text: str) -> str:
    text_lower = text.lower()
    for section, keywords in SECTION_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            return section
    return "general"

def extract_chunks(pdf_path: str, document_id: str, product_id: str) -> List[Dict]:
    chunks = []
    chunk_index = 0

    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""
            text = re.sub(r'\s+', ' ', text).strip()
            if not text:
                continue

            # Slide window over page text
            start = 0
            while start < len(text):
                end = start + CHUNK_SIZE
                chunk_text = text[start:end]

                if len(chunk_text.strip()) < 50:
                    break

                chunks.append({
                    "id": f"{document_id}_chunk_{chunk_index}",
                    "document_id": document_id,
                    "product_id": product_id,
                    "chunk_index": chunk_index,
                    "content": chunk_text.strip(),
                    "page_number": page_num,
                    "section_tag": classify_section(chunk_text),
                    "char_count": len(chunk_text),
                })
                chunk_index += 1
                start += CHUNK_SIZE - CHUNK_OVERLAP

    return chunks

def get_page_count(pdf_path: str) -> int:
    with pdfplumber.open(pdf_path) as pdf:
        return len(pdf.pages)
```

---

### `backend/services/moss_service.py`
```python
import asyncio
import time
from typing import List, Dict, Tuple
from moss import MossClient, QueryOptions
from moss_client import get_moss
from config import settings

async def create_product_index(product_id: str, chunks: List[Dict]) -> None:
    """Create or overwrite a MOSS index for a product with its document chunks."""
    client = get_moss()
    index_name = f"product-{product_id}"

    documents = [
        {
            "id": chunk["id"],
            "text": chunk["content"],
            "metadata": {
                "document_id": chunk["document_id"],
                "product_id": chunk["product_id"],
                "page_number": chunk.get("page_number", 0),
                "section_tag": chunk.get("section_tag", "general"),
                "chunk_index": chunk["chunk_index"],
            }
        }
        for chunk in chunks
    ]

    await client.create_index(index_name, documents)
    await client.load_index(index_name)

async def query_product_index(
    product_id: str,
    query: str,
    top_k: int = 5,
    section_filter: str | None = None
) -> Tuple[List[Dict], int]:
    """
    Query MOSS for relevant chunks.
    Returns (results, time_taken_ms).
    Uses hybrid search (semantic + keyword).
    Optionally filters by section_tag via metadata filter.
    """
    client = get_moss()
    index_name = f"product-{product_id}"

    # Ensure index is loaded
    try:
        await client.load_index(index_name)
    except Exception:
        pass  # already loaded

    options = QueryOptions(top_k=top_k)

    # Add metadata filter if section specified
    if section_filter:
        options.filter = {"section_tag": {"$eq": section_filter}}

    start = time.time()
    results = await client.query(index_name, query, options)
    elapsed_ms = int((time.time() - start) * 1000)

    return results.docs, elapsed_ms

async def delete_product_index(product_id: str) -> None:
    client = get_moss()
    index_name = f"product-{product_id}"
    try:
        await client.delete_index(index_name)
    except Exception:
        pass
```

---

### `backend/services/assistant_service.py`
```python
import json
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
```

---

### `backend/services/voice_service.py`
```python
import tempfile
import os
from openai import AsyncOpenAI
from config import settings

client = AsyncOpenAI(api_key=settings.openai_api_key)

async def transcribe_audio(audio_bytes: bytes, filename: str = "audio.webm") -> str:
    """Use OpenAI Whisper to transcribe audio to text."""
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        with open(tmp_path, "rb") as audio_file:
            transcription = await client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="en",
                response_format="text",
            )
        return transcription.strip()
    finally:
        os.unlink(tmp_path)
```

---

### `backend/services/image_service.py`
```python
from openai import AsyncOpenAI
from config import settings

client = AsyncOpenAI(api_key=settings.openai_api_key)

IMAGE_ANALYSIS_PROMPT = """You are analyzing a product image for diagnostic purposes.
Describe exactly what you see:
1. What component or part is shown?
2. What visual abnormalities, damage, or wear are visible? (burns, corrosion, leaks, cracks, discoloration, etc.)
3. What is the likely condition status? (new/good, worn, damaged, failed)
4. What diagnostic clues does this image provide?

Be specific and factual. Use technical terms when appropriate. Keep to 3-4 sentences."""

async def analyze_product_image(image_url: str) -> str:
    """Pre-analyze an uploaded image before the diagnostic assistant responds."""
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": image_url, "detail": "high"}},
                    {"type": "text", "text": IMAGE_ANALYSIS_PROMPT}
                ]
            }
        ],
        max_tokens=300,
        temperature=0.2,
    )
    return response.choices[0].message.content
```

---

### `backend/routers/auth.py`
```python
from fastapi import APIRouter, HTTPException
from models.schemas import RegisterRequest, LoginRequest
from database import supabase

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(body: RegisterRequest):
    # 1. Create Supabase auth user
    try:
        res = supabase.auth.sign_up({"email": body.email, "password": body.password})
        user_id = res.user.id
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 2. If company role, create company record
    if body.role == "company":
        if not body.company_name:
            raise HTTPException(status_code=400, detail="company_name is required for company accounts")
        supabase.table("companies").insert({
            "user_id": user_id,
            "name": body.company_name,
        }).execute()

    return {"message": "Account created", "user_id": user_id, "role": body.role}

@router.post("/login")
async def login(body: LoginRequest):
    try:
        res = supabase.auth.sign_in_with_password({"email": body.email, "password": body.password})
        user = res.user
        session = res.session
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Check if company account
    company = supabase.table("companies").select("*").eq("user_id", user.id).maybe_single().execute()
    role = "company" if company.data else "user"

    return {
        "access_token": session.access_token,
        "user_id": user.id,
        "email": user.email,
        "role": role,
        "company": company.data,
    }
```

---

### `backend/routers/products.py`
```python
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from models.schemas import ProductCreate, ProductUpdate
from database import supabase

router = APIRouter(prefix="/products", tags=["products"])

@router.get("")
async def list_products(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
):
    offset = (page - 1) * limit
    query = supabase.table("products").select(
        "*, companies(name, logo_url)", count="exact"
    ).eq("is_published", True)

    if category:
        query = query.eq("category", category)
    if search:
        query = query.ilike("name", f"%{search}%")

    result = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
    return {"products": result.data, "total": result.count, "page": page, "limit": limit}

@router.get("/{product_id}")
async def get_product(product_id: str):
    result = supabase.table("products").select(
        "*, companies(name, logo_url, description), knowledge_documents(*)"
    ).eq("id", product_id).single().execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data

@router.post("")
async def create_product(body: ProductCreate, company_id: str):
    result = supabase.table("products").insert({
        **body.model_dump(),
        "company_id": company_id,
        "moss_index_id": None,
    }).execute()
    return result.data[0]

@router.put("/{product_id}")
async def update_product(product_id: str, body: ProductUpdate):
    result = supabase.table("products").update(
        body.model_dump(exclude_none=True)
    ).eq("id", product_id).execute()
    return result.data[0]

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    from services.moss_service import delete_product_index
    await delete_product_index(product_id)
    supabase.table("products").delete().eq("id", product_id).execute()
    return {"message": "Product deleted"}

@router.get("/company/{company_id}")
async def get_company_products(company_id: str):
    result = supabase.table("products").select(
        "*, knowledge_documents(id, title, indexed)"
    ).eq("company_id", company_id).order("created_at", desc=True).execute()
    return result.data
```

---

### `backend/routers/knowledge.py`
```python
import os
import tempfile
import uuid
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks
from models.schemas import DocumentLinkCreate
from database import supabase
from services.pdf_service import extract_chunks, get_page_count
from services.moss_service import create_product_index

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

async def _index_product(product_id: str):
    """Background task: pull all chunks for a product and rebuild MOSS index."""
    chunks = supabase.table("document_chunks").select("*").eq("product_id", product_id).execute()
    if not chunks.data:
        return

    try:
        await create_product_index(product_id, chunks.data)
        supabase.table("products").update(
            {"moss_index_id": f"product-{product_id}"}
        ).eq("id", product_id).execute()
        # Mark all docs as indexed
        supabase.table("knowledge_documents").update(
            {"indexed": True, "indexing_error": None}
        ).eq("product_id", product_id).execute()
    except Exception as e:
        supabase.table("knowledge_documents").update(
            {"indexing_error": str(e)}
        ).eq("product_id", product_id).execute()

@router.post("/upload/{product_id}")
async def upload_document(
    product_id: str,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str = Form(...),
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = await file.read()
    doc_id = str(uuid.uuid4())
    storage_path = f"products/{product_id}/{doc_id}.pdf"

    # Upload to Supabase Storage
    supabase.storage.from_("knowledge").upload(storage_path, file_bytes, {"content-type": "application/pdf"})
    file_url = supabase.storage.from_("knowledge").get_public_url(storage_path)

    # Save temp file for parsing
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        page_count = get_page_count(tmp_path)
        chunks = extract_chunks(tmp_path, doc_id, product_id)
    finally:
        os.unlink(tmp_path)

    # Save document record
    supabase.table("knowledge_documents").insert({
        "id": doc_id,
        "product_id": product_id,
        "title": title,
        "type": "pdf",
        "file_url": file_url,
        "page_count": page_count,
        "chunk_count": len(chunks),
        "indexed": False,
    }).execute()

    # Save chunks to DB
    chunk_rows = [{
        "id": c["id"],
        "document_id": doc_id,
        "product_id": product_id,
        "chunk_index": c["chunk_index"],
        "content": c["content"],
        "page_number": c["page_number"],
        "section_tag": c["section_tag"],
        "char_count": c["char_count"],
    } for c in chunks]

    # Insert in batches of 100
    for i in range(0, len(chunk_rows), 100):
        supabase.table("document_chunks").insert(chunk_rows[i:i+100]).execute()

    # Trigger background MOSS indexing
    background_tasks.add_task(_index_product, product_id)

    return {
        "document_id": doc_id,
        "title": title,
        "page_count": page_count,
        "chunk_count": len(chunks),
        "message": "Document uploaded and indexing started"
    }

@router.post("/link/{product_id}")
async def add_link(product_id: str, body: DocumentLinkCreate, background_tasks: BackgroundTasks):
    result = supabase.table("knowledge_documents").insert({
        "product_id": product_id,
        "title": body.title,
        "type": body.type,
        "external_url": body.external_url,
        "indexed": False,
    }).execute()
    return result.data[0]

@router.delete("/{document_id}")
async def delete_document(document_id: str):
    doc = supabase.table("knowledge_documents").select("*").eq("id", document_id).single().execute()
    if not doc.data:
        raise HTTPException(status_code=404, detail="Document not found")

    supabase.table("document_chunks").delete().eq("document_id", document_id).execute()
    supabase.table("knowledge_documents").delete().eq("id", document_id).execute()

    # Re-index product
    product_id = doc.data["product_id"]
    from fastapi import BackgroundTasks
    background_tasks = BackgroundTasks()
    background_tasks.add_task(_index_product, product_id)

    return {"message": "Document deleted and index rebuilding"}
```

---

### `backend/routers/assistant.py`
```python
import uuid
import time
from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse
from database import supabase
from services.moss_service import query_product_index
from services.assistant_service import get_diagnostic_reply, build_source_citations

router = APIRouter(prefix="/assistant", tags=["assistant"])

def _advance_step(current_step: int, message_count: int) -> int:
    """Advance diagnostic step based on conversation depth."""
    if message_count <= 2:
        return 1
    elif message_count <= 4:
        return 2
    elif message_count <= 6:
        return 3
    elif message_count <= 8:
        return 4
    elif message_count <= 10:
        return 5
    return 6

@router.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest):
    # 1. Get or create session
    session = supabase.table("diagnostic_sessions").select("*").eq(
        "session_token", body.session_token
    ).maybe_single().execute()

    if not session.data:
        # Create new session
        session_data = {
            "product_id": body.product_id,
            "session_token": body.session_token,
            "status": "active",
            "diagnostic_step": 1,
        }
        session_result = supabase.table("diagnostic_sessions").insert(session_data).execute()
        session_id = session_result.data[0]["id"]
        current_step = 1
    else:
        session_id = session.data["id"]
        current_step = session.data.get("diagnostic_step", 1)

    message_count = len(body.conversation_history)
    new_step = _advance_step(current_step, message_count)

    # 2. Query MOSS for relevant context
    # Use 'troubleshooting' section filter for first few messages, then broaden
    section_filter = "troubleshooting" if new_step <= 3 else None
    moss_results, retrieval_ms = await query_product_index(
        product_id=body.product_id,
        query=body.message,
        top_k=5,
        section_filter=section_filter,
    )

    # 3. Get document metadata for citations
    doc_ids = list(set([
        getattr(r, 'metadata', {}).get('document_id', '') for r in moss_results
    ]))
    db_chunks_map = {}
    if doc_ids:
        docs = supabase.table("knowledge_documents").select(
            "id, title"
        ).in_("id", doc_ids).execute()
        db_chunks_map = {d["id"]: d for d in docs.data}

    # 4. Get AI reply
    reply = await get_diagnostic_reply(
        user_message=body.message,
        conversation_history=body.conversation_history,
        moss_results=moss_results,
        db_chunks_map=db_chunks_map,
        diagnostic_step=new_step,
        image_url=body.image_url,
    )

    sources = build_source_citations(moss_results, db_chunks_map)

    # 5. Save messages to DB
    supabase.table("chat_messages").insert([
        {
            "session_id": session_id,
            "role": "user",
            "content": body.message,
            "input_type": body.input_type,
            "image_url": body.image_url,
        },
        {
            "session_id": session_id,
            "role": "assistant",
            "content": reply,
            "sources": [s for s in sources],
            "retrieval_ms": retrieval_ms,
        }
    ]).execute()

    # 6. Update session step
    supabase.table("diagnostic_sessions").update({
        "diagnostic_step": new_step
    }).eq("id", session_id).execute()

    return ChatResponse(
        reply=reply,
        sources=sources,
        retrieval_ms=retrieval_ms,
        diagnostic_step=new_step,
        session_token=body.session_token,
    )
```

---

### `backend/routers/voice.py`
```python
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.voice_service import transcribe_audio
import httpx
from config import settings

router = APIRouter(prefix="/voice", tags=["voice"])

@router.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    audio_bytes = await audio.read()
    if len(audio_bytes) < 1000:
        raise HTTPException(status_code=400, detail="Audio too short or empty")
    text = await transcribe_audio(audio_bytes, audio.filename)
    return {"transcript": text}

@router.post("/speak")
async def text_to_speech(body: dict):
    """Convert text to speech using ElevenLabs."""
    text = body.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{settings.elevenlabs_voice_id}"
    headers = {
        "xi-api-key": settings.elevenlabs_api_key,
        "Content-Type": "application/json",
    }
    payload = {
        "text": text,
        "model_id": "eleven_turbo_v2",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.8},
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers, timeout=30)

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="TTS service error")

    from fastapi.responses import Response
    return Response(content=response.content, media_type="audio/mpeg")
```

---

### `backend/routers/image.py`
```python
import uuid
from fastapi import APIRouter, UploadFile, File
from database import supabase
from services.image_service import analyze_product_image

router = APIRouter(prefix="/image", tags=["image"])

@router.post("/upload/{product_id}")
async def upload_image(product_id: str, file: UploadFile = File(...)):
    """Upload a diagnostic image to Supabase Storage and return public URL."""
    file_bytes = await file.read()
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["jpg", "jpeg", "png", "webp"]:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Only JPG/PNG/WebP allowed")

    img_id = str(uuid.uuid4())
    path = f"diagnostic/{product_id}/{img_id}.{ext}"
    supabase.storage.from_("knowledge").upload(path, file_bytes, {"content-type": f"image/{ext}"})
    url = supabase.storage.from_("knowledge").get_public_url(path)

    # Pre-analyze the image
    analysis = await analyze_product_image(url)

    return {"image_url": url, "analysis": analysis}
```

---

### `backend/main.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, products, knowledge, assistant, voice, image
from config import settings

app = FastAPI(title="Mantis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(knowledge.router)
app.include_router(assistant.router)
app.include_router(voice.router)
app.include_router(image.router)

@app.get("/health")
async def health():
    return {"status": "ok"}
```

---

## 6. FRONTEND — COMPLETE IMPLEMENTATION

### `frontend/tailwind.config.ts`
Define the entire design system here. DO NOT deviate from these tokens.

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base
        bg: {
          primary:   '#0C0C0E',   // deepest background
          secondary: '#131316',   // card background
          tertiary:  '#1A1A1F',   // elevated card / input
          hover:     '#21212A',   // hover state
        },
        border: {
          subtle:  'rgba(255,255,255,0.06)',
          default: 'rgba(255,255,255,0.10)',
          strong:  'rgba(255,255,255,0.18)',
        },
        text: {
          primary:   '#FFFFFF',
          secondary: 'rgba(255,255,255,0.60)',
          muted:     'rgba(255,255,255,0.35)',
          disabled:  'rgba(255,255,255,0.20)',
        },
        // Brand accent — electric violet
        brand: {
          50:  '#F0EFFE',
          100: '#DDD9FD',
          200: '#BBB4FB',
          400: '#7B6CF7',
          500: '#6356F5',  // primary brand
          600: '#4D42D4',
          700: '#3A30A8',
          800: '#29217C',
          900: '#1A1552',
        },
        // Status
        success: '#22C55E',
        warning: '#F59E0B',
        error:   '#EF4444',
        info:    '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Custom scale
        '2xs': ['10px', { lineHeight: '14px' }],
        'xs':  ['12px', { lineHeight: '16px' }],
        'sm':  ['14px', { lineHeight: '20px' }],
        'base':['16px', { lineHeight: '24px' }],
        'lg':  ['18px', { lineHeight: '28px' }],
        'xl':  ['20px', { lineHeight: '30px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '38px' }],
        '4xl': ['36px', { lineHeight: '44px' }],
        '5xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
        '6xl': ['60px', { lineHeight: '68px', letterSpacing: '-0.025em' }],
        '7xl': ['72px', { lineHeight: '80px', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        'sm':  '6px',
        'md':  '10px',
        'lg':  '14px',
        'xl':  '18px',
        '2xl': '24px',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow':  'spin 3s linear infinite',
        'glow':       'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glow:    { '0%,100%': { boxShadow: '0 0 20px rgba(99,86,245,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(99,86,245,0.6)' } },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'radial-brand': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,86,245,0.15), transparent)',
      },
    },
  },
  plugins: [],
}
export default config
```

---

### `frontend/app/globals.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { box-sizing: border-box; }
  html { background-color: #0C0C0E; color: #FFFFFF; }
  body { min-height: 100vh; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  ::selection { background: rgba(99,86,245,0.3); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.10); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.20); }
}

@layer components {
  .card {
    @apply bg-bg-secondary border border-border-subtle rounded-xl;
  }
  .card-hover {
    @apply card transition-all duration-200 hover:border-border-default hover:bg-bg-tertiary;
  }
  .btn-primary {
    @apply bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-2.5 rounded-lg
           transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed;
  }
  .btn-secondary {
    @apply bg-bg-tertiary border border-border-default hover:bg-bg-hover text-text-primary
           font-medium px-5 py-2.5 rounded-lg transition-all duration-150 active:scale-95;
  }
  .btn-ghost {
    @apply hover:bg-bg-tertiary text-text-secondary hover:text-text-primary
           font-medium px-4 py-2 rounded-lg transition-all duration-150;
  }
  .input-field {
    @apply w-full bg-bg-tertiary border border-border-subtle hover:border-border-default
           focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30
           text-text-primary placeholder:text-text-muted rounded-lg px-4 py-2.5
           text-sm transition-all duration-150;
  }
  .label {
    @apply text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5 block;
  }
  .section-heading {
    @apply text-4xl md:text-5xl font-bold text-text-primary tracking-tight;
  }
  .section-sub {
    @apply text-lg text-text-secondary max-w-2xl;
  }
  .badge {
    @apply inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full;
  }
  .badge-brand {
    @apply badge bg-brand-500/10 text-brand-400 border border-brand-500/20;
  }
  .badge-success {
    @apply badge bg-success/10 text-success border border-success/20;
  }
  .badge-warning {
    @apply badge bg-warning/10 text-warning border border-warning/20;
  }
  .badge-error {
    @apply badge bg-error/10 text-error border border-error/20;
  }
  .divider {
    @apply w-full h-px bg-border-subtle;
  }
  .gradient-text {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary;
  }
}
```

---

### `frontend/types/index.ts`
```typescript
export interface User {
  id: string
  email: string
  role: 'company' | 'user'
}

export interface Company {
  id: string
  user_id: string
  name: string
  description?: string
  logo_url?: string
  website_url?: string
  created_at: string
}

export interface Product {
  id: string
  company_id: string
  name: string
  model_number?: string
  category: string
  description: string
  image_url?: string
  is_published: boolean
  moss_index_id?: string
  created_at: string
  companies?: {
    name: string
    logo_url?: string
    description?: string
  }
  knowledge_documents?: KnowledgeDocument[]
}

export interface KnowledgeDocument {
  id: string
  product_id: string
  title: string
  type: 'pdf' | 'text' | 'link' | 'video_link'
  file_url?: string
  external_url?: string
  page_count?: number
  chunk_count?: number
  indexed: boolean
  indexing_error?: string
  created_at: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  input_type: 'text' | 'voice' | 'image'
  image_url?: string
  sources?: SourceCitation[]
  retrieval_ms?: number
  created_at: Date
}

export interface SourceCitation {
  doc_title: string
  page?: number
  section?: string
  score: number
  snippet: string
}

export interface DiagnosticSession {
  session_token: string
  product_id: string
  diagnostic_step: number
}

export type ProductCategory =
  | 'scooter'
  | 'ac'
  | 'washing_machine'
  | 'electronics'
  | 'appliance'
  | 'other'

export const CATEGORIES: { value: ProductCategory; label: string; icon: string }[] = [
  { value: 'scooter',          label: 'Scooters & Bikes', icon: '🛵' },
  { value: 'ac',               label: 'Air Conditioners', icon: '❄️' },
  { value: 'washing_machine',  label: 'Washing Machines', icon: '🫧' },
  { value: 'electronics',      label: 'Electronics',      icon: '⚡' },
  { value: 'appliance',        label: 'Appliances',       icon: '🏠' },
  { value: 'other',            label: 'Other',            icon: '🔧' },
]
```

---

### `frontend/stores/authStore.ts`
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Company } from '@/types'

interface AuthState {
  user: User | null
  company: Company | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string, company?: Company) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      company: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, token, company) =>
        set({ user, accessToken: token, company: company ?? null, isAuthenticated: true }),
      clearAuth: () =>
        set({ user: null, accessToken: null, company: null, isAuthenticated: false }),
    }),
    { name: 'mantis-auth' }
  )
)
```

---

### `frontend/stores/chatStore.ts`
```typescript
import { create } from 'zustand'
import type { Message, DiagnosticSession } from '@/types'
import { v4 as uuid } from 'uuid'

interface ChatState {
  messages: Message[]
  session: DiagnosticSession | null
  isLoading: boolean
  isRecording: boolean
  isSpeaking: boolean
  diagnosticStep: number
  pendingImageUrl: string | null

  initSession: (productId: string) => void
  addMessage: (msg: Omit<Message, 'id' | 'created_at'>) => void
  setLoading: (v: boolean) => void
  setRecording: (v: boolean) => void
  setSpeaking: (v: boolean) => void
  setDiagnosticStep: (step: number) => void
  setPendingImage: (url: string | null) => void
  clearSession: () => void
}

export const useChatStore = create<ChatState>()((set, get) => ({
  messages: [],
  session: null,
  isLoading: false,
  isRecording: false,
  isSpeaking: false,
  diagnosticStep: 1,
  pendingImageUrl: null,

  initSession: (productId) => {
    const token = uuid()
    set({
      session: { session_token: token, product_id: productId, diagnostic_step: 1 },
      messages: [],
      diagnosticStep: 1,
    })
  },

  addMessage: (msg) => {
    const full: Message = { id: uuid(), created_at: new Date(), ...msg }
    set((s) => ({ messages: [...s.messages, full] }))
  },

  setLoading:       (v) => set({ isLoading: v }),
  setRecording:     (v) => set({ isRecording: v }),
  setSpeaking:      (v) => set({ isSpeaking: v }),
  setDiagnosticStep:(step) => set({ diagnosticStep: step }),
  setPendingImage:  (url) => set({ pendingImageUrl: url }),
  clearSession:     () => set({ messages: [], session: null, diagnosticStep: 1 }),
}))
```

---

### `frontend/hooks/useVoiceInput.ts`
```typescript
'use client'
import { useState, useRef, useCallback } from 'react'
import { api } from '@/lib/api'
import { useChatStore } from '@/stores/chatStore'
import { toast } from 'sonner'

export function useVoiceInput() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const { setRecording } = useChatStore()

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.start(100)
      setRecording(true)
    } catch (err) {
      toast.error('Microphone access denied')
    }
  }, [setRecording])

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const recorder = mediaRecorderRef.current
      if (!recorder) return reject('No recorder')

      recorder.onstop = async () => {
        setRecording(false)
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const stream = recorder.stream
        stream.getTracks().forEach(t => t.stop())

        try {
          const formData = new FormData()
          formData.append('audio', blob, 'recording.webm')
          const res = await api.post<{ transcript: string }>('/voice/transcribe', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          resolve(res.data.transcript)
        } catch {
          reject('Transcription failed')
        }
      }

      recorder.stop()
    })
  }, [setRecording])

  return { startRecording, stopRecording }
}
```

---

### `frontend/hooks/useTextToSpeech.ts`
```typescript
'use client'
import { useCallback } from 'react'
import { api } from '@/lib/api'
import { useChatStore } from '@/stores/chatStore'

export function useTextToSpeech() {
  const { setSpeaking } = useChatStore()

  const speak = useCallback(async (text: string) => {
    // Truncate to first 500 chars for TTS (keep it concise)
    const textToSpeak = text.replace(/\*\*/g, '').replace(/\[.*?\]/g, '').slice(0, 500)

    try {
      setSpeaking(true)
      const res = await api.post('/voice/speak', { text: textToSpeak }, { responseType: 'arraybuffer' })
      const audioCtx = new AudioContext()
      const buffer = await audioCtx.decodeAudioData(res.data)
      const source = audioCtx.createBufferSource()
      source.buffer = buffer
      source.connect(audioCtx.destination)
      source.onended = () => setSpeaking(false)
      source.start()
    } catch {
      setSpeaking(false)
    }
  }, [setSpeaking])

  return { speak }
}
```

---

### `frontend/lib/api.ts`
```typescript
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) useAuthStore.getState().clearAuth()
    return Promise.reject(err)
  }
)
```

---

### `frontend/app/layout.tsx`
```tsx
import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Mantis — AI Product Support',
  description: 'Intelligent diagnostic assistant for any product. Voice, image, and text troubleshooting powered by your product manual.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary">
        <div className="min-h-screen bg-grid-pattern bg-radial-brand">
          <Navbar />
          <main>{children}</main>
        </div>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: { background: '#1A1A1F', border: '1px solid rgba(255,255,255,0.10)', color: '#fff' }
          }}
        />
      </body>
    </html>
  )
}
```

---

### `frontend/app/page.tsx` — LANDING PAGE
Build this exactly. It is the most important page for first impressions.

```
HERO SECTION:
- Full-viewport-height dark section
- Centered content
- Small pill badge above heading: "Powered by MOSS · Sub-10ms retrieval"
  (badge-brand style, with a green pulsing dot before text)
- Main heading (text-6xl font-bold): "Your product,  " then line break, then a gradient span
  reading "always understood."
- Sub-text (text-lg text-text-secondary max-w-xl mx-auto text-center mt-6):
  "The only support platform where the AI thinks like a technician — not a search engine.
   Voice, image, and text troubleshooting powered by your product's manual."
- Two CTA buttons side-by-side centered mt-10:
  * Primary (btn-primary): "Browse Products →"  → links to /products
  * Secondary (btn-secondary): "List Your Product" → links to /auth/signup?role=company
- Below buttons, a subtle stat row (mt-16): three stats separated by vertical dividers:
  * "<10ms" / "Retrieval Speed"
  * "100%" / "Manual-Grounded Answers"
  * "Voice + Image" / "Troubleshooting"
  Each stat: large number in text-3xl font-bold text-white, label in text-sm text-text-muted

HOW IT WORKS SECTION (py-24):
- "How Mantis works" heading centered
- Three step cards in a horizontal row (responsive: stack on mobile):
  Card 1: Icon=Upload, Step "01", title "Upload your manual", desc "Companies upload PDFs, service docs, and links. Mantis indexes everything in under 60 seconds using MOSS."
  Card 2: Icon=MessageSquare, Step "02", title "Describe the issue", desc "Users type, speak, or photograph the problem. The assistant reads the symptom like an experienced technician."
  Card 3: Icon=CheckCircle, Step "03", title "Get a diagnosis", desc "Mantis asks follow-up questions, narrows root causes, and cites the exact manual section for every recommendation."
- Each card: dark card with a glowing brand-colored number, icon, title, description

CATEGORIES SECTION (py-20):
- "Browse by product type" heading
- 6 category cards in 3-column grid (CATEGORIES array)
- Each card: centered emoji icon (text-3xl), category name below, hover lifts with brand border
- Clicking any navigates to /products?category=VALUE

TRUST SECTION (py-20):
- "Built on technology that never makes things up" heading
- Paragraph explaining MOSS-grounded retrieval, GPT-4o, citation system
- A subtle terminal-like code block showing a sample MOSS query returning in 3.1ms

FOOTER:
- Dark (bg-bg-secondary), border-top border-border-subtle
- Left: Mantis logo + tagline
- Right: Links (Products, For Companies, GitHub)
- Bottom row: "© 2025 Mantis · Built for PClub × MOSS Hackathon"
```

---

### `frontend/app/products/page.tsx` — MARKETPLACE
```
Layout:
- Page header: "Product Marketplace" (text-4xl font-bold) + product count
- Left sidebar (hidden on mobile, 240px wide):
  * Search input (magnifying glass icon, input-field style, live debounced search)
  * "Category" section with clickable pills for each CATEGORIES entry
  * Active filter highlighted with brand color
- Main area: ProductGrid component

ProductGrid:
- 3-column grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- gap-5
- Maps over products array and renders ProductCard for each
- If no results: empty state with magnifying glass icon + "No products found" text

ProductCard (card-hover style):
- Product image: 16:9 aspect ratio, object-cover, rounded-lg, fallback gradient if no image
- Category badge (top-right of image, absolute positioned)
- Company logo (tiny circle, bottom-left of image, overlapping)
- Product name: text-lg font-semibold mt-3
- Model number: text-sm text-text-muted if present
- Company name: text-sm text-text-secondary with building icon
- Bottom row: knowledge doc count badge + "Start Diagnosis →" button
- Clicking card navigates to /products/[id]

Pagination:
- Simple "Load more" button at bottom if more products exist
```

---

### `frontend/app/products/[id]/page.tsx` — PRODUCT DETAIL
```
Layout: Two-column on desktop (product info left, CTA right)

Left Column:
- Product image (full width, aspect-video, rounded-2xl)
- Product name (text-4xl font-bold mt-6)
- Company chip: company logo + name, clickable
- Category badge
- Description (text-text-secondary)
- "Knowledge Base" section:
  * Header: "Available Documentation"
  * List of KnowledgeDocuments with icon (PDF=file, link=external-link, video=play-circle)
  * Each item: title, type badge, page count if PDF
  * Each PDF has a "Download" button

Right Column (sticky top-6):
- Dark card with brand glow border
- Heading: "Get AI Diagnosis"
- Sub: "Talk to Mantis, your dedicated product technician."
- Three input mode pills: "Text", "Voice", "Image" (tabs)
- Brief description of each mode
- Big CTA button: "Start Diagnosis →" → links to /products/[id]/assistant
- Below: 6-step workflow preview (small numbered list of the diagnostic stages)
- Bottom: "Retrieved in <10ms via MOSS" subtle badge in green
```

---

### `frontend/app/products/[id]/assistant/page.tsx` — DIAGNOSTIC ASSISTANT

This is the most important page. Build it with extreme care.

```
LAYOUT: Full-height two-panel layout
Left panel (280px, hidden on mobile): Product info sidebar
  - Product image (small, 80px tall, rounded-lg)
  - Product name + company
  - DiagnosticProgress component (see below)
  - Horizontal divider
  - "Knowledge Base" mini-list (document titles)
  - "Clear session" button at bottom

Right panel (flex-1): Chat interface
  - Header bar:
    * Product name
    * Badge: current diagnostic step (e.g. "Step 2/6 — Elimination")
    * RetrievalBadge: "MOSS · Xms" with green dot
    * Speaker toggle button (on/off for TTS auto-play)

  - Chat message area (flex-1, overflow-y-auto, px-4 py-6):
    * Renders list of MessageBubble components
    * Auto-scrolls to bottom on new message
    * Shows Spinner when isLoading=true

  - InputBar (fixed at bottom):
    * Text input (grows with content, max 4 lines)
    * Left side: ImageUploadButton (camera icon)
    * Right side: VoiceButton (mic icon) + Send button
    * If pendingImageUrl set: shows image thumbnail above input with X to remove
    * Press Enter to send (Shift+Enter for newline)

MESSAGE BUBBLE:
User messages:
  - Right-aligned
  - Background: brand-500/15 with brand border
  - If voice: small mic icon prefix
  - If image: renders the uploaded image above text

Assistant messages:
  - Left-aligned
  - Background: bg-tertiary
  - Avatar: small "M" circle in brand color
  - Renders content with react-markdown (supports bold, lists, code)
  - Below content: SourceCitation row (if sources exist)
  - Below sources: RetrievalBadge ("Retrieved in Xms via MOSS")
  - If auto-speak enabled: speaker pulses while speaking

SOURCE CITATION PILLS:
  - Small horizontal scrollable row
  - Each citation: clickable pill showing "📄 {doc_title} · Page {page}"
  - Hover shows tooltip with snippet
  - Section tag shown as tiny colored dot

DIAGNOSTIC PROGRESS COMPONENT:
  - Vertical stepper (left sidebar) or horizontal stepper (mobile top)
  - 6 steps: Intake, Hypothesis, Elimination, Inspection, Narrowing, Resolution
  - Current step highlighted with brand color + glow
  - Completed steps show check icon in success green
  - Future steps are muted

VOICE BUTTON BEHAVIOR:
  - Click to start recording → button glows red with pulsing animation
  - Click again to stop → shows "Transcribing..." spinner
  - On transcript ready → auto-fills input field
  - Input bar shows: 🎙️ "Voice input: {transcript}" prefix

IMAGE UPLOAD BEHAVIOR:
  - Click camera icon → file picker (accept jpg/png/webp)
  - File selected → upload to /image/upload/{product_id}
  - While uploading: spinner on button
  - On success: thumbnail appears above input, image_url stored in state
  - User can still type text message to accompany image
  - On send: message shows image + text, assistant sees both

INITIAL MESSAGE (auto-sent on page load):
Send to assistant automatically:
  "Hello! I'm ready to help you diagnose issues with your {product.name}.
   What problem are you experiencing today? Describe any symptoms — sounds, behaviors, error lights, or anything unusual you've noticed."
```

---

### `frontend/app/dashboard/` — COMPANY DASHBOARD

```
SIDEBAR LAYOUT (DashboardSidebar):
- Company logo + name at top
- Navigation links:
  * Overview (home icon)
  * My Products (package icon)
  * Settings (settings icon)
- Mantis logo + "Company Dashboard" at bottom
- User avatar + email + logout at very bottom

DASHBOARD HOME (/dashboard):
- "Welcome back, {company.name}" heading
- 4 stats cards in grid:
  * Total Products
  * Published Products
  * Total Documents Indexed
  * Total Diagnostic Sessions
- "Your Products" section: mini table of products with status badges

PRODUCTS LIST (/dashboard/products):
- "Your Products" heading + "Add Product" button (btn-primary)
- Table: Product name | Category | Status (Published/Draft) | Docs | Actions
- Actions: Edit | Knowledge Base | Publish toggle | Delete
- Empty state: illustration + "Add your first product" CTA

ADD PRODUCT (/dashboard/products/new):
- "Add a new product" heading
- Form (react-hook-form + zod):
  * Product Name (required)
  * Model Number (optional)
  * Category (select dropdown with CATEGORIES)
  * Description (textarea, min 20 chars)
  * Product Image URL (optional, shows preview)
- On submit: POST /products → redirect to /dashboard/products/{id}/knowledge

KNOWLEDGE BASE (/dashboard/products/[id]/knowledge):
- "Knowledge Base — {product.name}" heading
- Status bar: "MOSS Index: {indexed/not indexed}" with green/yellow badge
- Two tabs: "Upload Files" | "Add Links"

UPLOAD FILES TAB:
- react-dropzone area: dashed border, "Drop PDF files here or click to browse"
  (accepts only .pdf)
- Title input (auto-filled from filename, editable)
- Upload button → shows progress bar during upload
- Below: DocumentList component showing existing documents
  * Each row: file icon | title | page count | chunk count | "Indexed ✓" or spinner
  * Delete button (red trash icon)

ADD LINKS TAB:
- Form: Title input + URL input + Type select (Link / YouTube Video)
- Add button → appends to list
- Shows list of existing links
```

---

## 7. COMPONENT DETAILS

### `frontend/components/assistant/RetrievalBadge.tsx`
```tsx
// Props: ms: number
// Renders: small pill showing "⚡ Moss · {ms}ms"
// Color: green if ms < 10, yellow if ms < 50, gray otherwise
// Has subtle pulsing green dot when ms < 10
// Font: font-mono text-xs
// Position: appears below each assistant message
```

### `frontend/components/assistant/DiagnosticProgress.tsx`
```tsx
// Props: currentStep: number (1-6)
const STEPS = [
  { step: 1, label: 'Intake',      desc: 'Understanding symptoms' },
  { step: 2, label: 'Hypothesis',  desc: 'Identifying causes' },
  { step: 3, label: 'Elimination', desc: 'Asking follow-ups' },
  { step: 4, label: 'Inspection',  desc: 'Suggesting checks' },
  { step: 5, label: 'Narrowing',   desc: 'Finding root cause' },
  { step: 6, label: 'Resolution',  desc: 'Corrective actions' },
]
// Renders vertical stepper
// Completed steps: green check circle
// Current step: brand-colored circle with pulsing glow, label in white
// Future steps: gray circle with number, label in text-muted
```

### `frontend/components/assistant/VoiceButton.tsx`
```tsx
// States:
// idle:         Mic icon, text-text-secondary
// recording:    Mic icon, red color, pulsing ring animation (animate-ping on pseudo-ring)
// transcribing: Spinner icon, text-brand-400
// Props: onTranscript: (text: string) => void
```

### `frontend/components/assistant/ImageUploadButton.tsx`
```tsx
// States:
// idle:      Camera icon
// uploading: Spinner
// done:      Check icon (green)
// Hidden file input, triggers on button click
// Accepts: image/jpeg,image/png,image/webp
// Max size: 5MB (validate client-side, show toast if exceeded)
// On file select → POST /image/upload/{productId} → call onUploaded(url, analysis)
```

---

## 8. SUBMITTING A CHAT MESSAGE — EXACT FLOW

```
When user submits (text or voice or image):

1. useChatStore.addMessage({ role: 'user', content: text, input_type, image_url })
2. useChatStore.setLoading(true)
3. POST /assistant/chat with:
   {
     session_token: session.session_token,
     product_id: product.id,
     message: text,
     input_type: 'text' | 'voice' | 'image',
     image_url: pendingImageUrl | null,
     conversation_history: messages.map(m => ({ role: m.role, content: m.content }))
   }
4. On response:
   a. useChatStore.addMessage({ role: 'assistant', content: reply, sources, retrieval_ms })
   b. useChatStore.setDiagnosticStep(diagnostic_step)
   c. If auto-speak enabled → useTextToSpeech().speak(reply)
   d. useChatStore.setPendingImage(null)
5. useChatStore.setLoading(false)
6. Scroll chat to bottom
7. Focus input
```

---

## 9. SCALABILITY PATTERNS — IMPLEMENT THESE

```
1. MOSS INDEX PER PRODUCT (not one global index)
   Each product has its own isolated MOSS index named "product-{uuid}".
   This means retrieval is always product-scoped, fast, and doesn't pollute across products.
   When a company deletes a product, delete its MOSS index.

2. CHUNK METADATA TAGGING (section filtering)
   Every chunk gets a section_tag: troubleshooting | maintenance | specifications | parts | safety | general
   The assistant uses $eq metadata filter to query only 'troubleshooting' chunks in early diagnostic steps,
   then broadens to all sections as the conversation deepens.

3. BACKGROUND INDEXING
   PDF upload → chunks saved to DB → background task rebuilds MOSS index
   This keeps the upload endpoint fast (<1s response) regardless of document size.
   Polling: frontend polls GET /products/{id} every 5s until moss_index_id is set.

4. SESSION TOKENS (anonymous + auth)
   Each chat session gets a UUID session_token generated client-side.
   This allows anonymous users to have persistent sessions within a browser tab
   without requiring login. Stored in chatStore (non-persisted — clears on tab close).

5. CONVERSATION HISTORY (last 10 messages)
   Only last 10 messages sent to LLM to manage context window.
   Full history stored in Supabase chat_messages table.
   Frontend keeps full history in Zustand for display.

6. SUPABASE STORAGE BUCKETS
   Create two buckets in Supabase:
   - "knowledge" (public) — for all uploaded PDFs and diagnostic images
   - Set max file size: 50MB for PDFs, 10MB for images

7. API RATE LIMITING (add if time permits)
   Basic in-memory rate limiter on /assistant/chat: max 30 requests per minute per session_token
```

---

## 10. SUPABASE STORAGE SETUP

In Supabase Dashboard → Storage → Create bucket:
```
Bucket name: knowledge
Public: YES (so files can be accessed via public URL)
Allowed MIME types: application/pdf, image/jpeg, image/png, image/webp
Max file size: 52428800 (50MB)
```

---

## 11. MOSS QUICKSTART REMINDER

Sign up at moss.dev → create a project → get `project_id` and `project_key`.
Add to backend `.env`.
Install: `pip install moss`
The Python SDK is async-first. Always call with `await`.
Index name convention: `"product-{product_uuid}"` — no spaces, lowercase.
On first run: `await client.create_index(name, docs)` creates and populates.
On subsequent queries: `await client.load_index(name)` loads into memory, then `await client.query(...)`.
The MOSS free tier supports up to 10 indexes and 100k documents — sufficient for the hackathon.

---

## 12. START COMMANDS

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # fill in all keys
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local  # fill in NEXT_PUBLIC_ keys
npm run dev                   # runs at http://localhost:3000
```

---

## 13. DEMO PRODUCT SEED DATA

For the hackathon demo, pre-load one real product:

**Product:** Honda Activa 6G  
**Category:** scooter  
**Model:** Activa 6G  
**Description:** Honda's best-selling automatic scooter, powered by a 109.51cc BS6 compliant engine.  
**Image:** Use a public Honda Activa image URL  

Upload the Honda Activa 6G Owner's Manual PDF (available free at hondamotorcycleindia.com).
This gives you a real product with real indexed documentation to demo the diagnostic assistant live.

---

## 14. FINAL DESIGN RULES — NON-NEGOTIABLE

```
1. Background: ALWAYS #0C0C0E (bg-primary). Never white. Never gray.
2. Cards: bg-bg-secondary (#131316) with border-border-subtle. Hover: bg-bg-tertiary.
3. Font: Inter everywhere. JetBrains Mono for code/latency numbers only.
4. Brand color: #6356F5 (brand-500) for primary actions, active states, current step.
5. Spacing: Use Tailwind spacing scale. Minimum 4px (p-1) inside components, 20px (p-5) inside cards.
6. Headings: font-bold (700), tracking-tight, text-white. Never font-black (900) — too heavy.
7. Secondary text: text-text-secondary (rgba white 60%). Muted: text-text-muted (35%).
8. Animations: Framer Motion for page transitions + component entry. Keep under 0.5s.
9. Loading states: Always show. Never leave the user wondering if something is happening.
10. Mobile: Every page must be usable on mobile (375px width minimum).
11. MOSS latency: Display it. The retrieval badge is a feature, not a debug artifact.
12. Error states: Toast for API errors. Inline error text for form validation.
13. Empty states: Never a blank page. Show an icon, a heading, and a CTA.
14. Image fallbacks: Every product image has a gradient fallback using category color.
15. Accessibility: All interactive elements have aria-labels. Color is never the only indicator.
```

---

*End of specification. Build everything exactly as described. Start from the backend (database schema → services → routers → main.py), then build the frontend (design tokens → layout → pages → components → stores → hooks). The demo product is Honda Activa 6G. The killer features are: voice input via Whisper, image upload via GPT-4o vision, and MOSS retrieval badged prominently in the UI.*

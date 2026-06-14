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

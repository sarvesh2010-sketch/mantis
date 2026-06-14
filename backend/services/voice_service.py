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

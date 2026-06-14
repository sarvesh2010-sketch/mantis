from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import Response
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

    return Response(content=response.content, media_type="audio/mpeg")

"""
Speech-to-Text using OpenAI Whisper API.
"""
import io
import openai


async def transcribe_audio(audio_bytes: bytes) -> str:
    """Transcribe audio bytes using OpenAI Whisper API.
    
    Args:
        audio_bytes: Raw audio data (webm/opus format from browser MediaRecorder)
    
    Returns:
        Transcribed text string
    """
    client = openai.AsyncOpenAI()
    
    audio_file = io.BytesIO(audio_bytes)
    audio_file.name = "recording.webm"
    
    try:
        transcript = await client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="text"
        )
        return transcript.strip()
    except Exception as e:
        print(f"STT Error: {e}")
        return ""

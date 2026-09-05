import json
import os
import re
from typing import Dict, Any

try:
    from google import genai
    from google.genai import types
    from google.genai.errors import APIError
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    types = None
    APIError = Exception
    GENAI_AVAILABLE = False


class AudioTranscriptionService:
    @staticmethod
    def normalize_mime_type(raw_mime: str) -> str:
        """
        Normalize browser MIME types (e.g. 'audio/webm;codecs=opus')
        into clean MIME types recognized by Gemini.
        """
        if not raw_mime:
            return "audio/webm"
        
        base_mime = raw_mime.split(";")[0].strip().lower()
        valid_mimes = {
            "audio/webm": "audio/webm",
            "audio/ogg": "audio/ogg",
            "audio/wav": "audio/wav",
            "audio/x-wav": "audio/wav",
            "audio/mp4": "audio/mp4",
            "audio/m4a": "audio/mp4",
            "audio/aac": "audio/aac",
            "audio/mpeg": "audio/mp3",
            "audio/mp3": "audio/mp3",
            "audio/flac": "audio/flac",
        }
        return valid_mimes.get(base_mime, "audio/webm")

    @classmethod
    def transcribe(cls, audio_bytes: bytes, mime_type: str = "audio/webm") -> Dict[str, Any]:
        """
        Transcribe audio bytes using Google Gemini multimodal API.
        Returns a dict: {"text": str, "language": str}
        """
        if not audio_bytes or len(audio_bytes) == 0:
            raise ValueError("Audio recording is empty (0 bytes received).")

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY environment variable is not configured on the server. "
                "Backend audio transcription requires a valid Gemini API key."
            )

        if not GENAI_AVAILABLE:
            raise RuntimeError(
                "The 'google-genai' library is not installed in the environment. "
                "Please install google-genai to enable audio transcription."
            )

        normalized_mime = cls.normalize_mime_type(mime_type)
        model_name = os.getenv("GEMINI_AUDIO_MODEL", "gemini-2.5-flash")

        client = genai.Client(api_key=api_key)

        prompt = (
            "You are an expert audio transcription system for Indian citizen public grievances.\n"
            "Analyze this recorded audio grievance and perform two tasks:\n"
            "1. Transcribe the spoken audio verbatim in its original spoken language and script "
            "(e.g. Hindi in Devanagari, Bhojpuri in Devanagari, Magahi in Devanagari, English, etc.). "
            "Do NOT summarize. Do NOT translate to English in the 'text' field. Preserve exact spoken words.\n"
            "2. Detect the primary spoken language or dialect (e.g. 'Hindi', 'Bhojpuri', 'Magahi', 'English', etc.).\n\n"
            "Return your response ONLY as a valid JSON object with the following schema:\n"
            "{\n"
            '  "text": "<verbatim original transcription>",\n'
            '  "language": "<identified language or dialect>"\n'
            "}"
        )

        audio_part = types.Part.from_bytes(
            data=audio_bytes,
            mime_type=normalized_mime,
        )

        try:
            # We configure json output response where supported
            config = types.GenerateContentConfig(
                temperature=0.0,
                response_mime_type="application/json",
            )
            response = client.models.generate_content(
                model=model_name,
                contents=[prompt, audio_part],
                config=config,
            )
        except Exception as e:
            # If application/json response_mime_type is rejected by older model variant, retry standard call
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=[prompt, audio_part],
                )
            except Exception as inner_err:
                raise RuntimeError(f"Gemini Audio API error: {str(inner_err)}") from inner_err

        raw_text = response.text or ""
        cleaned = raw_text.strip()
        
        # Remove markdown code fences if model enclosed JSON in ```json ... ```
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
            cleaned = re.sub(r"\s*```$", "", cleaned)
            cleaned = cleaned.strip()

        try:
            parsed = json.loads(cleaned)
            transcript_text = parsed.get("text", "").strip()
            language = parsed.get("language", "Auto-Detected").strip()
            return {
                "text": transcript_text,
                "language": language or "Auto-Detected"
            }
        except json.JSONDecodeError:
            # Fallback if raw text returned directly
            return {
                "text": cleaned,
                "language": "Auto-Detected"
            }

import base64
import json
import os
import re
from typing import Dict, Any

try:
    from google import genai
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    GENAI_AVAILABLE = False


class AudioTranscriptionService:
    SUPPORTED_AUDIO_MIMES = {
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

    @classmethod
    def normalize_mime_type(cls, raw_mime: str) -> str:
        """
        Normalize browser MIME types (e.g. 'audio/webm;codecs=opus')
        into clean MIME types recognized by Gemini.
        """
        if not raw_mime:
            return "audio/webm"
        
        base_mime = raw_mime.split(";")[0].strip().lower()
        if not base_mime:
            return "audio/webm"

        # If an explicit non-audio type was provided, flag as invalid
        if not base_mime.startswith("audio/") and base_mime != "application/octet-stream":
            raise ValueError(f"Unsupported audio format: '{raw_mime}'. Please upload a valid audio recording.")

        return cls.SUPPORTED_AUDIO_MIMES.get(base_mime, "audio/webm")

    @classmethod
    def transcribe(cls, audio_bytes: bytes, mime_type: str = "audio/webm") -> Dict[str, Any]:
        """
        Transcribe audio bytes using Google Gemini Interactions API.
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

        if not GENAI_AVAILABLE or genai is None:
            raise RuntimeError(
                "The 'google-genai' library is not installed in the environment. "
                "Please install google-genai to enable audio transcription."
            )

        normalized_mime = cls.normalize_mime_type(mime_type)
        model_name = os.getenv("GEMINI_AUDIO_MODEL", "gemini-3.7-flash")

        client = genai.Client(api_key=api_key)
        base64_audio = base64.b64encode(audio_bytes).decode("utf-8")

        prompt = (
            "You are an expert speech-to-text transcription engine for Indian citizen public grievances.\n"
            "Carefully listen to the provided audio recording and perform two tasks:\n"
            "1. Transcribe the spoken audio verbatim in its original spoken language and script "
            "(for example: Hindi in Devanagari, Bhojpuri in Devanagari, Magahi in Devanagari, Tamil in Tamil script, English in Latin script, etc.). "
            "Preserve all vernacular phrasing, colloquial expressions, and exact words spoken. "
            "Do NOT translate into English in the transcription. "
            "Do NOT summarize, paraphrase, or edit the citizen's words. "
            "Do NOT perform grievance categorization, priority scoring, or any policy analysis.\n"
            "2. Detect the primary spoken language or dialect (e.g. 'Hindi', 'Bhojpuri', 'Magahi', 'Tamil', 'English', etc.).\n\n"
            "Output strictly according to the requested JSON schema with 'text' and 'language'."
        )

        response_format = {
            "type": "text",
            "mime_type": "application/json",
            "schema": {
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "Verbatim transcription in original spoken language and script without translation or summarization.",
                    },
                    "language": {
                        "type": "string",
                        "description": "Primary detected language or dialect.",
                    },
                },
                "required": ["text", "language"],
            },
        }

        try:
            interaction = client.interactions.create(
                model=model_name,
                input=[
                    {"type": "text", "text": prompt},
                    {
                        "type": "audio",
                        "data": base64_audio,
                        "mime_type": normalized_mime,
                    },
                ],
                response_format=response_format,
            )
        except Exception as err:
            raise RuntimeError(f"Gemini Audio API error: {str(err)}") from err

        output_text = getattr(interaction, "output_text", None)
        if not output_text and hasattr(interaction, "steps"):
            steps = getattr(interaction, "steps", []) or []
            for step in reversed(steps):
                step_type = getattr(step, "type", None) or (step.get("type") if isinstance(step, dict) else None)
                if step_type == "model_output":
                    content = getattr(step, "content", None) or (step.get("content") if isinstance(step, dict) else [])
                    parts = []
                    for item in content:
                        item_type = getattr(item, "type", None) or (item.get("type") if isinstance(item, dict) else None)
                        if item_type == "text":
                            t = getattr(item, "text", None) or (item.get("text") if isinstance(item, dict) else "")
                            if t:
                                parts.append(t)
                    if parts:
                        output_text = "".join(parts)
                        break

        if not output_text or not output_text.strip():
            raise RuntimeError("Gemini Audio API returned an empty transcription response.")

        cleaned = output_text.strip()
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
            cleaned = re.sub(r"\s*```$", "", cleaned)
            cleaned = cleaned.strip()

        try:
            parsed = json.loads(cleaned)
            if isinstance(parsed, dict):
                transcript_text = str(parsed.get("text", "") or "").strip()
                language = str(parsed.get("language", "") or "Auto-Detected").strip()
            else:
                transcript_text = cleaned
                language = "Auto-Detected"
        except json.JSONDecodeError:
            transcript_text = cleaned
            language = "Auto-Detected"

        if not transcript_text:
            raise RuntimeError("Gemini Audio API response did not contain transcription text.")

        return {
            "text": transcript_text,
            "language": language or "Auto-Detected"
        }


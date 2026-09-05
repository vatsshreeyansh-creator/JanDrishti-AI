import os
from google import genai
from google.genai import types
import schemas

class GeminiAIService:
    @classmethod
    def get_client(cls) -> genai.Client:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY environment variable is missing. Please configure GEMINI_API_KEY in the backend environment."
            )
        return genai.Client(api_key=api_key)

    @classmethod
    def analyze_report(cls, text: str) -> dict:
        """
        Analyzes a citizen grievance report using Google Gemini.
        Returns structured analysis containing:
          - category: One of Road Infrastructure, Water Supply, Healthcare, Education, Digital Connectivity, General
          - severity: LOW, MEDIUM, HIGH, CRITICAL
          - urgency: LOW, MEDIUM, HIGH, CRITICAL
          - language: Name of identified language/dialect (e.g., Hindi, English, Tamil, Bhojpuri, etc.)
          - translated_text: Clear, faithful English translation/summary
          - confidence: Integer confidence score (0-100)
        """
        if not text or not text.strip():
            raise ValueError("Grievance text cannot be empty.")

        client = cls.get_client()
        model_name = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

        system_instruction = (
            "You are the JanDrishti AI grievance analysis engine for civic governance. "
            "Analyze citizen reports submitted in any Indian language, dialect, or English. "
            "Determine the following:\n"
            "1. category: Choose strictly from ['Road Infrastructure', 'Water Supply', 'Healthcare', 'Education', 'Digital Connectivity', 'General'].\n"
            "2. severity: Physical infrastructure degradation or hazard level ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').\n"
            "3. urgency: Temporal dispatch need or immediate public danger ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').\n"
            "4. language: Detect the language or dialect used by the citizen (e.g. Hindi, English, Bhojpuri, Kannada, Tamil, Marathi, etc.).\n"
            "5. translated_text: Provide an accurate, faithful English translation or administrative summary preserving the citizen's original meaning and specific details without hallucinating or rewriting the claim.\n"
            "6. confidence: An integer between 0 and 100 representing classification and extraction confidence based on report clarity."
        )

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=schemas.GrievanceAnalysis,
            temperature=0.1,
        )

        response = client.models.generate_content(
            model=model_name,
            contents=f"Citizen Grievance Report:\n\"\"\"\n{text.strip()}\n\"\"\"",
            config=config,
        )

        if not response.text:
            raise RuntimeError("Gemini API returned an empty response.")

        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()

        try:
            analysis = schemas.GrievanceAnalysis.model_validate_json(raw_text)
        except Exception as e:
            raise RuntimeError(f"Failed to parse Gemini grievance analysis output: {e}") from e

        return analysis.model_dump()

    @classmethod
    def translate_to_english(cls, text: str) -> str:
        """Helper to obtain English translation/summary of a report."""
        result = cls.analyze_report(text)
        return result.get("translated_text", text)


# Backward compatibility alias
MockAIService = GeminiAIService


class PriorityEngine:
    @staticmethod
    def calculate_priority(demand_score: int, gap_score: int, impact_score: int, urgency_score: int, investment_score: int) -> int:
        """
        30% Citizen Demand
        25% Infrastructure Gap
        20% Population Impact
        15% Urgency
        10% Existing Investment Gap
        """
        score = (
            (demand_score * 0.30) +
            (gap_score * 0.25) +
            (impact_score * 0.20) +
            (urgency_score * 0.15) +
            (investment_score * 0.10)
        )
        return int(min(100, max(0, score)))

    @staticmethod
    def map_severity_to_score(severity: str) -> int:
        mapping = {"CRITICAL": 95, "HIGH": 80, "MEDIUM": 50, "LOW": 20}
        return mapping.get(severity, 50)


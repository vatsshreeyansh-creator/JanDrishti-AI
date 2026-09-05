import random
from deep_translator import GoogleTranslator
from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException

LANGUAGE_MAP = {
    'hi': 'Hindi', 'kn': 'Kannada', 'ta': 'Tamil', 'te': 'Telugu',
    'mr': 'Marathi', 'gu': 'Gujarati', 'bn': 'Bengali', 'ml': 'Malayalam',
    'en': 'English', 'ur': 'Urdu', 'pa': 'Punjabi', 'or': 'Odia'
}

class MockAIService:
    @staticmethod
    def translate_to_english(text: str, source_language: str = 'auto') -> str:
        try:
            return GoogleTranslator(source=source_language, target='en').translate(text)
        except Exception:
            return f"[Demo Fallback English Summary]: {text}"

    @staticmethod
    def analyze_report(text: str):
        # 1. Language Detection
        try:
            lang_code = detect(text)
            language = LANGUAGE_MAP.get(lang_code, f"Lang-{lang_code.upper()}")
        except LangDetectException:
            lang_code = 'en'
            language = "Unknown"

        # 2. English Translation & Summary
        if lang_code == 'en':
            translated_text = text
        else:
            translated_text = MockAIService.translate_to_english(text)

        # 3. AI Extraction based on English translation
        text_lower = translated_text.lower()
        
        category = "General"
        severity = "MEDIUM"
        urgency = "MEDIUM"
        
        if any(word in text_lower for word in ["road", "pothole", "street", "highway", "damage", "ambulance"]):
            category = "Road Infrastructure"
            severity = "HIGH" if "accident" in text_lower or "ambulance" in text_lower else "MEDIUM"
            urgency = "HIGH" if "ambulance" in text_lower else "MEDIUM"
        elif any(word in text_lower for word in ["water", "pipeline", "tap", "drinking", "drain"]):
            category = "Water Supply"
            severity = "CRITICAL" if "days" in text_lower or "no water" in text_lower else "HIGH"
        elif any(word in text_lower for word in ["hospital", "doctor", "health", "clinic"]):
            category = "Healthcare"
            urgency = "HIGH"
            severity = "CRITICAL"
        elif any(word in text_lower for word in ["school", "teacher", "education"]):
            category = "Education"
        elif any(word in text_lower for word in ["internet", "network", "connectivity"]):
            category = "Digital Connectivity"
            severity = "LOW"
            
        return {
            "category": category,
            "severity": severity,
            "urgency": urgency,
            "language": language,
            "translated_text": translated_text,
            "confidence": random.randint(85, 98)
        }

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

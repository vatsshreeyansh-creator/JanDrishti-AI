from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ReportCreate(BaseModel):
    text: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    location_name: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None

class ReportResponse(BaseModel):
    id: int
    text: str
    translated_text: Optional[str] = None
    language: Optional[str] = None
    category: str
    severity: str
    status: str
    location_name: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    created_at: datetime
    priority_score: int

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_reports: int
    active_reports: int
    resolved_reports: int
    active_hotspots: int
    high_priority_issues: int
    citizens_affected: int
    projects_recommended: int
    est_investment_cr: float

class HotspotResponse(BaseModel):
    id: int
    name: str
    lat: float
    lng: float
    priority_score: int
    citizens_affected: int
    category: str
    report_count: int

class RecommendationResponse(BaseModel):
    id: int
    title: str
    description: str
    est_cost_cr: float
    citizens_benefited: int
    reasoning: str
    hotspot_id: int
    hotspot_name: str
    priority_score: int

class BudgetSimulationRequest(BaseModel):
    total_budget_cr: float

class BudgetSimulationResponse(BaseModel):
    category: str
    recommended_allocation: float
    citizens_benefited: int
    gap_reduction: float

class RiskAlertResponse(BaseModel):
    id: int
    location: str
    risk_type: str
    risk_score: int
    description: str
    recommendation: str

class ImpactMetricResponse(BaseModel):
    id: int
    project_name: str
    location: str
    before_complaints: int
    after_complaints: int
    before_travel_time_min: int
    after_travel_time_min: int
    before_accessibility_score: int
    after_accessibility_score: int
    overall_impact_score: int

class NotificationResponse(BaseModel):
    id: int
    report_id: Optional[int]
    message: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

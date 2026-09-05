from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class CitizenReport(Base):
    __tablename__ = "citizen_reports"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    translated_text = Column(Text, nullable=True)
    language = Column(String)
    category = Column(String, index=True)
    severity = Column(String)
    urgency = Column(String)
    location_name = Column(String)
    state = Column(String, index=True)
    district = Column(String, index=True)
    lat = Column(Float)
    lng = Column(Float)
    status = Column(String, default="Under Review")
    priority_score = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    cluster_id = Column(Integer, ForeignKey("issue_clusters.id"), nullable=True)
    cluster = relationship("IssueCluster", back_populates="reports")

class IssueCluster(Base):
    __tablename__ = "issue_clusters"
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True)
    district = Column(String, index=True)
    theme = Column(String)
    report_count = Column(Integer, default=0)
    avg_severity_score = Column(Float, default=0.0)
    
    reports = relationship("CitizenReport", back_populates="cluster")
    hotspot = relationship("Hotspot", back_populates="cluster", uselist=False)

class Hotspot(Base):
    __tablename__ = "hotspots"
    id = Column(Integer, primary_key=True, index=True)
    cluster_id = Column(Integer, ForeignKey("issue_clusters.id"))
    name = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    priority_score = Column(Integer, default=0)
    citizens_affected = Column(Integer, default=0)
    infrastructure_gap = Column(Integer, default=0) # 0-100
    
    cluster = relationship("IssueCluster", back_populates="hotspot")
    recommendation = relationship("Recommendation", back_populates="hotspot", uselist=False)

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    hotspot_id = Column(Integer, ForeignKey("hotspots.id"))
    title = Column(String)
    description = Column(Text)
    est_cost_cr = Column(Float)
    citizens_benefited = Column(Integer)
    reasoning = Column(Text)
    
    hotspot = relationship("Hotspot", back_populates="recommendation")

class RiskAlert(Base):
    __tablename__ = "risk_alerts"
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String)
    risk_type = Column(String)
    risk_score = Column(Integer)
    description = Column(Text)
    recommendation = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ImpactMetric(Base):
    __tablename__ = "impact_metrics"
    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String)
    location = Column(String)
    before_complaints = Column(Integer)
    after_complaints = Column(Integer)
    before_travel_time_min = Column(Integer)
    after_travel_time_min = Column(Integer)
    before_accessibility_score = Column(Integer)
    after_accessibility_score = Column(Integer)
    overall_impact_score = Column(Integer)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, nullable=True)
    message = Column(String)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


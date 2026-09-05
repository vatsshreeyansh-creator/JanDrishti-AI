from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

import models, schemas, database, services, seed

app = FastAPI(title="JanDrishti API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)
seed.seed()


@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/dashboard/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(database.get_db)):
    total_reports = db.query(models.CitizenReport).count()
    active_reports = db.query(models.CitizenReport).filter(models.CitizenReport.status != "Resolved").count()
    resolved_reports = db.query(models.CitizenReport).filter(models.CitizenReport.status == "Resolved").count()
    
    active_hotspots = db.query(models.Hotspot).count()
    high_priority = db.query(models.CitizenReport).filter(models.CitizenReport.priority_score > 80).count()
    citizens_affected = db.query(func.sum(models.Hotspot.citizens_affected)).scalar() or 0
    projects_recommended = db.query(models.Recommendation).count()
    est_investment = db.query(func.sum(models.Recommendation.est_cost_cr)).scalar() or 0.0
    
    return {
        "total_reports": total_reports,
        "active_reports": active_reports,
        "resolved_reports": resolved_reports,
        "active_hotspots": active_hotspots,
        "high_priority_issues": high_priority,
        "citizens_affected": citizens_affected,
        "projects_recommended": projects_recommended,
        "est_investment_cr": round(est_investment, 2)
    }

@app.get("/api/reports", response_model=List[schemas.ReportResponse])
def get_reports(limit: int = 1000, sort_by: str = "priority", db: Session = Depends(database.get_db)):
    query = db.query(models.CitizenReport)
    if sort_by == "recent":
        query = query.order_by(models.CitizenReport.created_at.desc(), models.CitizenReport.id.desc())
    else:
        query = query.order_by(models.CitizenReport.priority_score.desc(), models.CitizenReport.created_at.desc(), models.CitizenReport.id.desc())
    
    reports = query.limit(limit).all()
    return reports

@app.post("/api/reports", response_model=schemas.ReportResponse)
def create_report(report: schemas.ReportCreate, db: Session = Depends(database.get_db)):
    try:
        ai_result = services.GeminiAIService.analyze_report(report.text)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except RuntimeError as re:
        raise HTTPException(status_code=503, detail=str(re))
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI grievance analysis service error: {str(e)}")

    
    urgency_score = services.PriorityEngine.map_severity_to_score(ai_result["urgency"])
    priority = services.PriorityEngine.calculate_priority(
        demand_score=60, gap_score=50, impact_score=40, urgency_score=urgency_score, investment_score=50
    )
    
    db_report = models.CitizenReport(
        text=report.text,
        translated_text=ai_result.get("translated_text"),
        lat=report.lat,
        lng=report.lng,
        location_name=report.location_name or "Unknown Location",
        state=report.state,
        district=report.district,
        language=ai_result.get("language"),
        category=ai_result["category"],
        severity=ai_result["severity"],
        urgency=ai_result["urgency"],
        priority_score=priority,
        status="Under Review"
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    # Generate notification
    notif = models.Notification(
        report_id=db_report.id,
        message=f"Your report #JD-{db_report.id} has been received and is being analyzed."
    )
    db.add(notif)
    db.commit()
    
    # -------------------------------------------------------------
    # REAL-TIME HOTSPOT & CLUSTER GENERATION
    # -------------------------------------------------------------
    import random
    
    # Check if a cluster exists for this category and district
    cluster = db.query(models.IssueCluster).filter(
        models.IssueCluster.category == db_report.category,
        models.IssueCluster.district == db_report.district
    ).first()

    if cluster:
        cluster.report_count += 1
        db_report.cluster_id = cluster.id
        db.commit()
        
        # Update associated hotspot
        if cluster.hotspot:
            cluster.hotspot.citizens_affected += random.randint(100, 500)
            cluster.hotspot.priority_score = min(100, cluster.hotspot.priority_score + 5)
            db.commit()
    else:
        # Create new cluster
        new_cluster = models.IssueCluster(
            category=db_report.category,
            district=db_report.district or "Unknown",
            theme=f"{db_report.category} Issues",
            report_count=1,
            avg_severity_score=urgency_score
        )
        db.add(new_cluster)
        db.commit()
        db.refresh(new_cluster)
        
        db_report.cluster_id = new_cluster.id
        db.commit()
        
        # Create new hotspot
        new_hotspot = models.Hotspot(
            cluster_id=new_cluster.id,
            name=f"Emerging {db_report.category} Zone ({db_report.district or 'Local'})",
            lat=db_report.lat or 20.0,
            lng=db_report.lng or 78.0,
            priority_score=priority,
            citizens_affected=random.randint(200, 1000),
            infrastructure_gap=random.randint(40, 90)
        )
        db.add(new_hotspot)
        db.commit()
        db.refresh(new_hotspot)
        
        # Create a new recommendation for the budget simulator
        new_rec = models.Recommendation(
            hotspot_id=new_hotspot.id,
            title=f"Resolve {db_report.category} in {db_report.district or 'Local'}",
            description=f"Automated AI recommendation based on recent citizen signals regarding {db_report.category.lower()}.",
            est_cost_cr=round(random.uniform(1.0, 10.0), 2),
            citizens_benefited=new_hotspot.citizens_affected + random.randint(500, 2000),
            reasoning="Spike in citizen reports indicates urgent need for infrastructure intervention."
        )
        db.add(new_rec)
        db.commit()
    
    return db_report

@app.get("/api/hotspots", response_model=List[schemas.HotspotResponse])
def get_hotspots(db: Session = Depends(database.get_db)):
    hotspots = db.query(models.Hotspot).all()
    res = []
    for h in hotspots:
        cat = h.cluster.category if h.cluster else "General"
        rc = h.cluster.report_count if h.cluster else 0
        res.append({
            "id": h.id,
            "name": h.name,
            "lat": h.lat,
            "lng": h.lng,
            "priority_score": h.priority_score,
            "citizens_affected": h.citizens_affected,
            "category": cat,
            "report_count": rc
        })
    return res

@app.get("/api/recommendations", response_model=List[schemas.RecommendationResponse])
def get_recommendations(db: Session = Depends(database.get_db)):
    recs = db.query(models.Recommendation).all()
    res = []
    for r in recs:
        res.append({
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "est_cost_cr": r.est_cost_cr,
            "citizens_benefited": r.citizens_benefited,
            "reasoning": r.reasoning,
            "hotspot_id": r.hotspot_id,
            "hotspot_name": r.hotspot.name if r.hotspot else "Unknown",
            "priority_score": r.hotspot.priority_score if r.hotspot else 0
        })
    return res

@app.post("/api/budget/simulate", response_model=List[schemas.BudgetSimulationResponse])
def simulate_budget(req: schemas.BudgetSimulationRequest, db: Session = Depends(database.get_db)):
    # Simple proportional allocation based on priority
    clusters = db.query(models.IssueCluster).all()
    categories = {}
    total_priority = 0
    for c in clusters:
        score = c.avg_severity_score * c.report_count
        categories[c.category] = categories.get(c.category, 0) + score
        total_priority += score
        
    res = []
    if total_priority > 0:
        for cat, score in categories.items():
            alloc = (score / total_priority) * req.total_budget_cr
            res.append({
                "category": cat,
                "recommended_allocation": round(alloc, 2),
                "citizens_benefited": int((alloc / req.total_budget_cr) * 50000),
                "gap_reduction": round((alloc / req.total_budget_cr) * 100, 1)
            })
    return res

class ReportStatusUpdate(schemas.BaseModel):
    status: str

@app.patch("/api/reports/{report_id}", response_model=schemas.ReportResponse)
def update_report_status(report_id: int, update: ReportStatusUpdate, db: Session = Depends(database.get_db)):
    db_report = db.query(models.CitizenReport).filter(models.CitizenReport.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    db_report.status = update.status
    db.commit()
    db.refresh(db_report)
    
    # Generate notification
    if update.status == "Under Review":
        msg = f"Your report #JD-{db_report.id} is now under review."
    elif update.status == "Under Investigation":
        msg = f"Officials are investigating your reported issue #JD-{db_report.id}."
    elif update.status == "Resolved":
        msg = f"Your reported issue #JD-{db_report.id} has been marked resolved."
    else:
        msg = f"Your report #JD-{db_report.id} status updated to {update.status}."
        
    notif = models.Notification(report_id=db_report.id, message=msg)
    db.add(notif)
    db.commit()
    
    return db_report

@app.get("/api/reports/{report_id}", response_model=schemas.ReportResponse)
def get_report(report_id: int, db: Session = Depends(database.get_db)):
    db_report = db.query(models.CitizenReport).filter(models.CitizenReport.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    return db_report

@app.get("/api/risks", response_model=List[schemas.RiskAlertResponse])
def get_risks(db: Session = Depends(database.get_db)):
    risks = db.query(models.RiskAlert).all()
    return risks

@app.get("/api/impact", response_model=List[schemas.ImpactMetricResponse])
def get_impacts(db: Session = Depends(database.get_db)):
    impacts = db.query(models.ImpactMetric).all()
    return impacts

@app.get("/api/notifications", response_model=List[schemas.NotificationResponse])
def get_notifications(db: Session = Depends(database.get_db)):
    notifs = db.query(models.Notification).order_by(models.Notification.id.desc()).limit(20).all()
    return notifs

@app.patch("/api/notifications/{notif_id}/read", response_model=schemas.NotificationResponse)
def read_notification(notif_id: int, db: Session = Depends(database.get_db)):
    notif = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    if notif:
        notif.is_read = True
        db.commit()
        db.refresh(notif)
    return notif

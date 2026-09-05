import random
from datetime import datetime, timedelta
from database import SessionLocal, engine
import models
from services import PriorityEngine

def seed():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(models.CitizenReport).count() > 0:
        print("Database already seeded.")
        return

    print("Seeding database...")
    
    categories = ["Road Infrastructure", "Water Supply", "Healthcare", "Education", "Digital Connectivity"]
    severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    states = ["Bihar", "Karnataka", "Tamil Nadu", "Maharashtra"]
    
    clusters = []
    # Create 10 clusters
    for i in range(10):
        cat = random.choice(categories)
        dist = f"District_{i}"
        c = models.IssueCluster(
            category=cat,
            district=dist,
            theme=f"{cat} issues in {dist}",
            report_count=random.randint(20, 150),
            avg_severity_score=random.uniform(50, 95)
        )
        db.add(c)
        clusters.append(c)
    db.commit()
    
    # Create 10 Hotspots
    for idx, c in enumerate(clusters):
        lat = 20.0 + random.uniform(-5, 5)
        lng = 78.0 + random.uniform(-5, 5)
        h = models.Hotspot(
            cluster_id=c.id,
            name=f"{c.district} {c.category} Hotspot",
            lat=lat,
            lng=lng,
            priority_score=int(c.avg_severity_score),
            citizens_affected=c.report_count * 150,
            infrastructure_gap=random.randint(40, 90)
        )
        db.add(h)
        db.commit()
        db.refresh(h)
        
        # Recommendation
        if h.priority_score > 70:
            rec = models.Recommendation(
                hotspot_id=h.id,
                title=f"Upgrade {c.category} in {c.district}",
                description=f"Comprehensive overhaul of {c.category.lower()} facilities.",
                est_cost_cr=round(random.uniform(5, 50), 2),
                citizens_benefited=h.citizens_affected,
                reasoning=f"High citizen demand ({c.report_count} reports). Severe infrastructure gap."
            )
            db.add(rec)
            db.commit()
    
    # Risks and Impacts
    for i in range(5):
        risk = models.RiskAlert(
            location=f"District_{i} Riverside",
            risk_type="Flood-related road failure",
            risk_score=random.randint(70, 95),
            description="High risk of complete washout during monsoon due to poor drainage.",
            recommendation="Inspect vulnerable roads and clear drainage before monsoon."
        )
        db.add(risk)
        
        impact = models.ImpactMetric(
            project_name=f"Rural Road Upgrade {i}",
            location=f"District_{i}",
            before_complaints=random.randint(1000, 3000),
            after_complaints=random.randint(50, 200),
            before_travel_time_min=random.randint(45, 90),
            after_travel_time_min=random.randint(20, 40),
            before_accessibility_score=random.randint(30, 50),
            after_accessibility_score=random.randint(75, 95),
            overall_impact_score=random.randint(80, 95)
        )
        db.add(impact)
    db.commit()
            
    # Create 5 reports
    for i in range(5):
        c = random.choice(clusters)
        sev = random.choice(severities)
        score = PriorityEngine.map_severity_to_score(sev)
        report = models.CitizenReport(
            text=f"Sample report {i} regarding {c.category.lower()}.",
            language="English",
            category=c.category,
            severity=sev,
            urgency=sev,
            location_name=f"{c.district} Area",
            state=random.choice(states),
            district=c.district,
            lat=20.0 + random.uniform(-5, 5),
            lng=78.0 + random.uniform(-5, 5),
            status="Under Review",
            priority_score=score,
            cluster_id=c.id,
            created_at=datetime.utcnow() - timedelta(minutes=random.randint(1, 10000))
        )
        db.add(report)
    
    db.commit()
    print("Seed complete.")

if __name__ == "__main__":
    seed()

# JanDrishti Application Audit & Current Status

**Last Verified:** September 2026  
**Repository:** Fresh Git repository on GitHub: [https://github.com/vatsshreeyansh-creator/JanDrishti-AI](https://github.com/vatsshreeyansh-creator/JanDrishti-AI) (`main` tracking `origin/main`, clean working tree)  
**Frontend Deployment:** Live on Vercel: [https://jan-drishti-ai.vercel.app/](https://jan-drishti-ai.vercel.app/) (commit `a1f10fc` - *"Make frontend API URL configurable"*)  
**Frontend API Configuration:** `src/api/client.ts` uses `VITE_API_URL` with `http://localhost:8000/api` as local fallback (TypeScript check and `npm run build` verified)  
**Backend Deployment:** Local FastAPI (`http://127.0.0.1:8000`) with SQLite (`backend/jandrishti.db`); **NOT publicly deployed yet** (planned as a Web Service on Render; note that Render Free uses an ephemeral filesystem, so local SQLite data is non-persistent across restart, redeploy, or spin-down)  
**Full-Stack Connection:** Incomplete in production because the public backend URL does not exist yet. Local development remains fully functional.

---

## 1. Fully Functional / Working Features

The following features are genuinely implemented and operational in the current codebase:

- **Configurable Frontend API Client** *(Locally Implemented & Build-Verified)*:
  - `src/api/client.ts` dynamically resolves the base API URL using `import.meta.env.VITE_API_URL` with trailing-slash normalization, falling back cleanly to `http://localhost:8000/api` for local development.
  - TypeScript checking (`tsc -b`) and production bundling (`npm run build`) verified clean.
- **Dual-Portal Routing and Layouts** *(Locally Implemented & Vercel Deployed)*:
  - Clean separation between Citizen (`/citizen`, `/citizen/report`, `/citizen/my-reports`) and Government (`/gov`, `/gov/map`, `/gov/hotspots`, `/gov/recommendations`, `/gov/budget`, `/gov/impact`, `/gov/risks`) layouts via React Router in `src/App.tsx`.
- **FastAPI REST Backend & Database Persistence** *(Backend-Connected & Database-Backed Locally)*:
  - FastAPI application in `backend/main.py` with SQLAlchemy ORM and SQLite (`backend/jandrishti.db`).
  - Tables created automatically on startup: `citizen_reports`, `issue_clusters`, `hotspots`, `recommendations`, `risk_alerts`, `impact_metrics`, and `notifications`.
- **Citizen Report Creation & Storage** *(Backend-Connected & Database-Backed)*:
  - Submitting a text report via `POST /api/reports` writes a new `CitizenReport` to SQLite and returns the created record with ID, status, category, and priority score.
- **Bi-Directional Status Management** *(Backend-Connected & Database-Backed)*:
  - Government officials can update report status (`Under Review` → `Under Investigation` → `Resolved`) via `PATCH /api/reports/{id}` directly from `GovOverview.tsx`.
  - Changes persist in the database and trigger automated `Notification` records.
- **Visual Status Progression Timeline** *(Locally Implemented & Database-Backed)*:
  - `MyReports.tsx` displays a 3-stage visual progress timeline (`1. Review` → `2. Investigation` → `3. Resolved`) that dynamically reflects the actual database status of each report.
- **Citizen In-App Notifications** *(Backend-Connected & Database-Backed)*:
  - Notifications are generated in `main.py` whenever a report is filed or updated.
  - The citizen navbar polls `GET /api/notifications` every 5 seconds, displays an unread count badge, shows a dropdown list, and supports marking notifications as read (`PATCH /api/notifications/{id}/read`).
- **Real-Time Polling Engine** *(Locally Implemented & Backend-Connected)*:
  - `GovOverview.tsx`, `CitizenHome.tsx`, `MyReports.tsx`, `GovHotspots.tsx`, and `GovRecommendations.tsx` poll their respective backend endpoints every 5 seconds, updating UI components when new data appears.
- **Interactive Spatial Map Rendering** *(Frontend Leaflet Integration)*:
  - `GovMap.tsx` and `CitizenHome.tsx` render real interactive maps using Leaflet / `react-leaflet` with Carto Dark/Light tile layers.
- **Multi-Language Translation Execution** *(External Service Integration)*:
  - `MockAIService.translate_to_english` in `backend/services.py` uses `deep_translator.GoogleTranslator` to perform real translation calls to Google's public translation endpoint, with fallback to raw text if offline. Language identification uses the Python `langdetect` library.
- **Interactive Budget Slider & Dynamic Charts** *(Frontend Recharts Integration)*:
  - `GovBudget.tsx` provides an interactive budget slider (₹50 Cr to ₹1000 Cr) with debounced requests to `POST /api/budget/simulate` and renders reactive bar charts via Recharts.

---

## 2. Partially Functional Features

Features that work in part, but have incomplete logic, client-side simulations, or missing sub-components:

- **Voice Complaint Recording (`src/pages/citizen/ReportIssue.tsx`)**:
  - *Current State*: Uses browser Web Speech API (`window.webkitSpeechRecognition` / `window.SpeechRecognition`) with hardcoded Indian English (`en-IN`).
  - *Limitation*: Runs purely in the client browser. Does not work on browsers lacking SpeechRecognition support (e.g., Firefox). Does not capture audio files or stream audio to the backend. Does not dynamically support regional Indian languages spoken by rural citizens.
- **Priority Math Breakdown Modal (`src/pages/citizen/ReportIssue.tsx` & `src/pages/gov/GovOverview.tsx`)**:
  - *Current State*: Both pages include a modal displaying the 5-part priority formula (30% Demand, 25% Gap, 20% Population, 15% Urgency, 10% Investment).
  - *Limitation*: The individual sub-scores are not stored or returned by the backend. The UI computes the breakdown client-side by multiplying the single composite `priority_score` by fixed percentages (`Math.round(priority_score * 0.30)`, etc.).
- **Citizen Community Dashboard Filtering (`src/pages/citizen/CitizenHome.tsx`)**:
  - *Current State*: Displays cards for "Active Issues Near You" and "Resolved in Area" alongside a neighborhood map.
  - *Limitation*: The component queries all reports (`/api/reports?limit=1000`) and client-side filters them using only the location string of the first report (`reports[0].location_name`). If the latest report is from a different district, the entire page switches context.

---

## 3. Simulated / Mock / Non-Real Intelligence and Data

The following features already have an implementation in the UI and backend, but their underlying intelligence, data, or calculations are simulated, hardcoded, synthetic, or rule-based:

### 3.1 Complaint Classification & Sentiment Extraction
- **UI Presentation**: `ReportIssue.tsx` claims "Processing via JanDrishti AI... Detecting Language • Translating • Analyzing Infrastructure • Calculating Priority". `GovOverview.tsx` displays structured categories, severity levels, and urgency ratings.
- **Actual Implementation**: `MockAIService.analyze_report` (`backend/services.py`). After translation, it executes naive Python substring matching (`if any(word in text_lower for word in ["road", "pothole", ...])`). Urgency and severity are assigned via simple word checks (e.g., presence of `"ambulance"` sets urgency to `HIGH`).
- **Required Real Integration**: Multimodal LLM integration (e.g., Gemini 1.5 Pro/Flash) with structured JSON output for zero-shot multi-label categorization, entity extraction, and sentiment/severity inference.

### 3.2 Priority Impact Scoring Formula
- **UI Presentation**: Claims an intelligent formula balancing Citizen Demand (30%), Infrastructure Gap (25%), Population Impact (20%), Urgency (15%), and Investment Gap (10%).
- **Actual Implementation**: `PriorityEngine.calculate_priority` in `backend/services.py` implements the formula, but `backend/main.py` calls it with hardcoded dummy constants: `demand_score=60, gap_score=50, impact_score=40, investment_score=50`. Only `urgency_score` varies (mapped from the keyword severity check).
- **Required Real Integration**: Real multi-factor calculation combining spatial report density (demand), GIS road/utility quality layers (gap), census population grids (impact), and actual municipal budget data.

### 3.3 Hotspot Detection & Spatial Clustering
- **UI Presentation**: `GovMap.tsx` and `GovHotspots.tsx` claim to display "AI-clustered hotspots" and "live infrastructure failure clusters across the state".
- **Actual Implementation**: Initial hotspots are randomly generated by `backend/seed.py` around coordinate `(20.0, 78.0)`. In `backend/main.py`, new reports are grouped purely by matching exact strings for `category` and `district`. If no match exists, a new hotspot is created with arbitrary coordinates. No density-based geospatial clustering (e.g., DBSCAN, HDBSCAN, or H3/S2 geospatial indexing) is performed.
- **Required Real Integration**: Geospatial clustering engine (PostGIS / Python `scikit-learn` DBSCAN) that clusters reports based on physical coordinates, proximity radiuses, and temporal density.

### 3.4 Citizens Affected / Affected Population
- **UI Presentation**: Dashboard KPI card ("Affected: 12.4k"), map marker radiuses, and hotspot popups displaying precise citizen counts.
- **Actual Implementation**: In `backend/seed.py`, `citizens_affected` is seeded as `report_count * 150`. In `backend/main.py`, submitting a report to an existing cluster adds a random integer (`random.randint(100, 500)`). A new cluster assigns `random.randint(200, 1000)`. The dashboard KPI is merely a SQL `SUM` of these random values.
- **Required Real Integration**: Integration with population density rasters (e.g., WorldPop, GHSL) or administrative ward census data intersected with the hotspot's geographic catchment area.

### 3.5 AI Project Recommendations & Reasoning
- **UI Presentation**: `GovRecommendations.tsx` presents "AI Recommended Projects" with "Citizen Evidence", "Infrastructure Evidence", estimated costs in ₹ Cr, and citizen beneficiaries.
- **Actual Implementation**: Seeded by `seed.py` with hardcoded text templates ("Upgrade {category} in {district}") and random costs (`random.uniform(5, 50)`). When a new cluster is created in `main.py`, a templated recommendation is created with `random.uniform(1.0, 10.0)` Cr.
- **Required Real Integration**: LLM-driven recommendation agent that analyzes specific complaint texts within a cluster, references public works standard schedule of rates (CPWD/PWD), and generates actionable project briefs.

### 3.6 Smart Budget Allocation Simulator
- **UI Presentation**: `GovBudget.tsx` claims to simulate "ROI and infrastructure gap reduction across sectors" and "Optimized for Maximum ROI".
- **Actual Implementation**: `POST /api/budget/simulate` in `backend/main.py` divides the user's budget proportionally based on `avg_severity_score * report_count`. Beneficiaries are computed using a dummy formula `(alloc / total_budget) * 50000`. Gap reduction is literally the allocation percentage itself (`(alloc / total_budget) * 100`).
- **Required Real Integration**: Operations research / mathematical optimization model (e.g., Linear Programming / Knapsack optimization) evaluating real project costs against departmental capital expenditure limits.

### 3.7 Predictive Risk Alerts
- **UI Presentation**: `GovRisks.tsx` claims a "Prototype Risk Model: Identifying infrastructure failure vectors before they happen" featuring model factors like Rainfall, Drainage, and Population Vulnerability.
- **Actual Implementation**: Static records pre-seeded in `models.RiskAlert` via `backend/seed.py` with random scores (`random.randint(70, 95)`). Model factors in the UI are hardcoded static badges.
- **Required Real Integration**: Automated risk pipeline integrating real weather forecasting APIs (e.g., IMD / Open-Meteo), hydrological flood maps, and historical complaint trends.

### 3.8 Impact Tracker (Before / After Metrics)
- **UI Presentation**: `GovImpact.tsx` displays Before/After charts for resolved projects showing changes in complaints, travel time (minutes), and accessibility scores.
- **Actual Implementation**: Static records pre-seeded in `models.ImpactMetric` via `backend/seed.py` with random integers. No connection to actual resolution workflows or post-intervention telemetry.
- **Required Real Integration**: Automated before/after evaluation engine that measures complaint frequency drop in a resolved hotspot radius over 30/60/90 days and gathers post-resolution citizen feedback.

### 3.9 Citizen Location / GPS Coordinates
- **UI Presentation**: `ReportIssue.tsx` displays "Gaya, Bihar (Auto-GPS)".
- **Actual Implementation**: Hardcoded in `ReportIssue.tsx` line 55: `const location = { lat: 24.7914, lng: 85.0002, name: 'Gaya, Bihar' };`. The browser Geolocation API is not called.
- **Required Real Integration**: Browser Geolocation API (`navigator.geolocation.getCurrentPosition`) with reverse geocoding via OpenStreetMap / Nominatim or MapmyIndia.

---

## 4. Known Non-Functional UI / Missing Connections

These items are static UI controls or unhandled actions that currently perform no operation:

- **Citizen Language Dropdown (`src/pages/citizen/ReportIssue.tsx`)**: Static `<select>` menu with "Language: Auto-detect", "Hindi", "English", "Kannada". Selecting an option does not change application behavior or backend parameters.
- **Citizen Report Search Bar (`src/pages/citizen/MyReports.tsx`)**: Text input with search icon. Does not filter the report list on keystroke or submit.
- **Citizen Report Card Click (`src/pages/citizen/MyReports.tsx`)**: Report list cards have hover and cursor-pointer styling, but clicking them performs no navigation or action.
- **Gov Map "VIEW INTELLIGENCE" Button (`src/pages/gov/GovMap.tsx`)**: Button in hotspot popup has no `onClick` handler.
- **Gov Map Critical / Warning Badges (`src/pages/gov/GovMap.tsx`)**: Summary counts at top right are non-clickable and do not filter map markers.
- **Gov Recommendations "Approve for Budgeting" Button (`src/pages/gov/GovRecommendations.tsx`)**: No `onClick` handler.
- **Gov Recommendations "Request Detail Report" Button (`src/pages/gov/GovRecommendations.tsx`)**: No `onClick` handler.
- **Gov "View Priority Engine →" Link (`src/pages/gov/GovOverview.tsx`)**: Links to `/gov/priority`, which is not registered in `src/App.tsx` (navigates to empty/unmatched route).

---

## 5. Known Bugs / Limitations

- **Public Frontend Currently Disconnected from Backend**:
  - The frontend is live on Vercel (`https://jan-drishti-ai.vercel.app/`), but because the backend is not yet deployed publicly, production requests currently fallback to `http://localhost:8000/api`. The public frontend will remain disconnected until the backend is deployed on Render and `VITE_API_URL` is set in Vercel.
- **Render Ephemeral Filesystem Limitation (Upcoming Backend Deployment)**:
  - The current backend architecture relies on a local SQLite database (`backend/jandrishti.db`). On Render's Free tier, the filesystem is ephemeral; data written to SQLite will not persist across container restarts, spin-downs, or redeployments.
- **Silent API Failure Handling**:
  - In `ReportIssue.tsx`, if the backend is unreachable or returns an error, the `catch` block logs to console and resets the UI to `idle`. No error toast or banner informs the user that submission failed.
- **Missing Global State / User Authentication**:
  - There is no authentication or user session. All citizen reports are loaded globally in `MyReports.tsx`, meaning every citizen sees all reports submitted by anyone.
  - Notifications are global; any user sees notifications generated for all reports.
- **Hardcoded Indian Coordinate Center**:
  - Maps default to center coordinates `[20.0, 78.0]` or `[28.6139, 77.2090]` (New Delhi) when local reports are absent.

---

## 6. Missing / Not Yet Implemented

Functionality that is not present in the current codebase:

- **Public Backend Deployment**: FastAPI backend is not yet hosted on a public cloud service.
- **Persistent Production Database**: PostgreSQL or managed database to replace ephemeral SQLite for production hosting.
- **User Authentication & Role-Based Access Control**: No login, JWT tokens, session management, or distinction between citizen accounts and government department credentials.
- **Media Uploads (Photos / Video / Audio)**: Citizen report submission only accepts text. No image upload, file attachment, or cloud object storage integration (e.g., S3/GCS).
- **Departmental Routing & Ticket Assignment**: No concept of municipal departments (e.g., PWD, Jal Board, Health Department) assigning tickets to field officers.
- **Citizen Feedback & Resolution Verification**: Citizens cannot confirm whether an issue marked "Resolved" was actually fixed on the ground.
- **Export & Reporting**: No PDF/Excel export for government intelligence summaries or budget recommendations.

---

## 7. Current Backend & Data Architecture

### Technology Stack & Deployment Plan
- **Framework**: FastAPI (Python 3.12 compatible)
- **ASGI Server**: Uvicorn
- **ORM**: SQLAlchemy 2.x
- **Database**: SQLite (`backend/jandrishti.db`) — remains part of the backend for hackathon/demo stage.
- **Hosting Plan**: FastAPI backend to be deployed separately on Render as a Web Service. Note that Render Free instances use an ephemeral filesystem, meaning local SQLite database data will not persist across service restarts, redeployments, or inactive spin-downs.
- **Dependencies**: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `deep-translator`, `langdetect`

### Database Schema & Models (`backend/models.py`)
| Model / Table | Purpose | Primary Fields |
| :--- | :--- | :--- |
| `CitizenReport` (`citizen_reports`) | Stores submitted citizen complaints | `id`, `text`, `translated_text`, `language`, `category`, `severity`, `urgency`, `location_name`, `lat`, `lng`, `status`, `priority_score`, `cluster_id`, `created_at` |
| `IssueCluster` (`issue_clusters`) | Groups reports by category and district | `id`, `category`, `district`, `theme`, `report_count`, `avg_severity_score` |
| `Hotspot` (`hotspots`) | Geographic failure zones linked 1:1 to clusters | `id`, `cluster_id`, `name`, `lat`, `lng`, `priority_score`, `citizens_affected`, `infrastructure_gap` |
| `Recommendation` (`recommendations`) | Interventions proposed for high-priority hotspots | `id`, `hotspot_id`, `title`, `description`, `est_cost_cr`, `citizens_benefited`, `reasoning` |
| `RiskAlert` (`risk_alerts`) | Pre-failure warning alerts | `id`, `location`, `risk_type`, `risk_score`, `description`, `recommendation`, `created_at` |
| `ImpactMetric` (`impact_metrics`) | Before/after metrics for completed projects | `id`, `project_name`, `location`, `before_complaints`, `after_complaints`, `before_travel_time_min`, `after_travel_time_min`, `overall_impact_score` |
| `Notification` (`notifications`) | Activity notifications for citizens | `id`, `report_id`, `message`, `is_read`, `created_at` |

### API Endpoints (`backend/main.py`)
- `GET /api/health` — Service health check
- `GET /api/dashboard/stats` — Aggregated KPI metrics
- `GET /api/reports` — List reports (supports `limit` and `sort_by=recent|priority`)
- `POST /api/reports` — Submit new report (triggers classification, cluster update, and notification)
- `GET /api/reports/{id}` — Get single report details
- `PATCH /api/reports/{id}` — Update report status
- `GET /api/hotspots` — List all hotspots
- `GET /api/recommendations` — List all intervention recommendations
- `POST /api/budget/simulate` — Proportional budget distribution across sectors
- `GET /api/risks` — List predictive risk alerts
- `GET /api/impact` — List impact tracker records
- `GET /api/notifications` — List recent notifications
- `PATCH /api/notifications/{id}/read` — Mark notification as read

### Seed Data Generator (`backend/seed.py`)
- Populates database if `CitizenReport` table is empty.
- Creates **10 issue clusters**, **10 hotspots**, **5 risk alerts**, **5 impact metrics**, and **5 sample citizen reports**.

---

## 8. Recommended Future Integrations

Based on the verified simulated features, the following integrations are needed to achieve real functionality:

1. **Multimodal LLM / Generative AI API (e.g., Google Gemini 1.5 Flash / Pro)**:
   - Replace keyword string matching in `MockAIService` with true semantic comprehension, audio transcription, multilingual classification, and contextual project recommendation generation.
2. **Speech-to-Text & Regional Language Services (e.g., Bhashini / Whisper)**:
   - Replace browser-only Web Speech API with a robust Indian language speech API supporting vernacular voice input and dialects.
3. **Geospatial Intelligence & Reverse Geocoding (e.g., PostGIS, Nominatim / MapmyIndia)**:
   - Replace hardcoded Gaya coordinates with HTML5 geolocation and real reverse geocoding.
   - Replace string-based district matching with spatial clustering algorithms (DBSCAN) operating on actual latitude/longitude coordinates.
4. **Demographic & Census Data Integration (e.g., WorldPop / Data.gov.in)**:
   - Replace `random.randint` for "citizens affected" with spatial queries against real population density grids.
5. **Weather & Environmental APIs (e.g., IMD / Open-Meteo)**:
   - Feed live meteorological and rainfall forecasts into the predictive risk model instead of static records.

---

## 9. Immediate Project Status Snapshot

- **What works now**:
  - Fresh Git repository initialized and pushed to GitHub: [https://github.com/vatsshreeyansh-creator/JanDrishti-AI](https://github.com/vatsshreeyansh-creator/JanDrishti-AI) (`main` tracking `origin/main`).
  - Frontend successfully built and deployed on Vercel: [https://jan-drishti-ai.vercel.app/](https://jan-drishti-ai.vercel.app/) (commit `a1f10fc`).
  - Frontend API client dynamically configured using `VITE_API_URL` with `http://localhost:8000/api` local fallback (TypeScript check and `npm run build` verified).
  - Local full-stack application works end-to-end (FastAPI + SQLite, polling, report submission, status updates, visual timeline, Leaflet map, and Recharts).
- **What is simulated**: AI classification (keyword matching in `MockAIService`), priority formula breakdown (client-side multiplication), hotspot clustering (static district matching), citizens affected (random integers), project recommendations (templated strings), budget simulation (basic proportional split), risk alerts (seeded mock records), and impact metrics (seeded mock records).
- **What is pending / broken**:
  - FastAPI backend is **NOT publicly deployed yet**; public frontend is disconnected from the backend in production until the backend is live on Render.
  - SQLite database on Render Free will be ephemeral (non-persistent across restarts/spin-downs).
  - Unlinked UI controls (e.g., "VIEW INTELLIGENCE", "Approve for Budgeting", search input, `/gov/priority` route link).
- **Immediate Next Steps (Sequence of Action)**:
  1. Deploy FastAPI backend to Render as a Web Service.
  2. Verify the public backend endpoint(s).
  3. Set `VITE_API_URL` in Vercel Production to the deployed backend API base URL.
  4. Redeploy/verify the frontend.
  5. Test the complete public full-stack application.
  6. Then continue with competition-focused improvements and real integrations.

---

## Maintaining This Document

This document is the **single source of truth** for the current implementation status of the JanDrishti codebase.

When modifying this repository, developers and automated agents should:
1. Consult this file before assuming how a feature is implemented.
2. Update the corresponding section whenever a simulated feature is replaced with real integration.
3. Keep the list of working, simulated, and non-functional items up to date to prevent repeated discovery work.

# STORMS: AI-Driven Hyper-Local Early Warning System for Severe Weather Nowcasting
**Smart India Hackathon (SIH) Problem Statement ID:** 26077  
**Organization:** Ministry of Earth Sciences (MoES)  
**Department:** National Centre for Medium Range Weather Forecasting (NCMRWF)  
**Theme:** Disaster Management  

---

## 🛰️ Dual-Portal Architecture

### 1. 👤 Citizen / Public Portal ("STORMS")
Tailored for general citizens and vulnerable communities, replicating the dark sleek UI from the design reference:
* **Interactive Weather Map:** Radar reflectivity over Mumbai / Vasai / Nalasopara / Virar / Arabian Sea with a 2-3h nowcasting time scrubber.
* **Next 3 Hours Forecast:** Hourly cards (*Now, 30 min, 1 hr, 2 hr, 3 hr*).
* **Your Area Card:** Vasai Gaon risk indicators (Low flood risk, Moderate thunderstorm risk).
* **Right Alert Column:**
  * 🚨 **Severe Rainfall Alert:** ETA 45 min, 3.2 km away.
  * **Why this alert? (XAI):** Public explainability for moisture surge.
  * **What should you do?:** Direct safety checklist.
  * **Areas to Avoid:** Inundation hotspots (*Vasai Creek Road, Nalasopara subways, Gaon Junction*).

---

### 2. 🛡️ Officials / Operations Center ("STORMS | OPERATIONS CENTER")
Engineered according to the exact ASCII wireframe specification for disaster management authorities (MoES / NCMRWF / NDRF / SDRF / Municipal Disaster Cells):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STORMS | OPERATIONS CENTER            ● SYSTEM OPERATIONAL                 │
├────────────┬───────────────────────────────────────────────┬────────────────┤
│            │                                               │ ACTIVE HAZARDS │
│ OVERVIEW   │                                               │                │
│ MAP        │               LIVE RISK MAP                   │ 🔴 CLOUD BURST │
│ HAZARDS    │                                               │ Maharashtra    │
│ SATELLITE  │          [hazard zones / node borders]        │ Risk: 87%      │
│ DATA       │                                               │ ETA: 45 min    │
│ NODES      │                                               │ Confidence 91% │
│ XAI        │                                               │                │
│            │                                               │ 🟠 HEAVY RAIN  │
│            │                                               │ Risk: 64%      │
├────────────┴───────────────────────────────────────────────┴────────────────┤
│ SELECTED REGION: Vasai Zone                                                 │
│                                                                             │
│ Risk Probability     Confidence       Expected Impact       ETA             │
│      87%                91%            HIGH                 45 min          │
├─────────────────────────────────────────────────────────────────────────────┤
│ WHY THIS ALERT?                 │ FORECAST TIMELINE                         │
│                                 │                                           │
│ • Rainfall intensity increasing │ NOW → +30m → +1h → +2h → +3h              │
│ • Strong moisture buildup       │ ████     █████    ██████                  │
│ • Storm development detected    │                                           │
├─────────────────────────────────┴───────────────────────────────────────────┤
│ METEOROLOGICAL EVIDENCE                                                     │
│ IWV ↑   CAPE ↑   CIN ↓   Convergence ↑   CTT ↓   QPE ↑                      │
│                                                                             │
│ MODEL INTERPRETATION: Conditions are becoming favorable for rapid           │
│ thunderstorm development and intense rainfall.                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Feature Breakdown:
* **Top Command Bar:** `STORMS | OPERATIONS CENTER`, glowing `● SYSTEM OPERATIONAL` telemetry badge, `RUN INFERENCE`, and `DISPATCH CAP ALERT` buttons.
* **3-Column Tactical Grid:**
  * **Left Navigation:** `OVERVIEW`, `MAP`, `HAZARDS`, `SATELLITE`, `DATA`, `NODES`, `XAI` with live latency (`0.8s`), lead time (`2-6h`), and spatial resolution (`1 km²`).
  * **Center Live Risk Map:** Interactive vector canvas with hazard zone polygons, real-time convective storm cores, radar sweep beams, and clickable station nodes (*Vasai, Nalasopara, Virar*).
  * **Right Active Hazards:**
    * 🔴 **CLOUD BURST** (Maharashtra) — Risk: `87%` • ETA: `45 min` • Confidence: `91%`
    * 🟠 **HEAVY RAIN** (North Palghar) — Risk: `64%` • ETA: `1h 15m` • Confidence: `86%`
    * 🌊 **FLASH FLOOD** (Nalasopara Basin) — Risk: `93%` • ETA: `30 min` • Confidence: `94%`
* **Selected Region Strip & 4 KPIs:**
  * Region banner: `SELECTED REGION: Vasai Zone` (interactive switcher for Vasai, Nalasopara, Virar).
  * Key performance indicators: **Risk Probability (87%)**, **Confidence (91%)**, **Expected Impact (HIGH)**, and **ETA (45 min)**.
* **Split Explanation Grid:**
  * **WHY THIS ALERT?:**
    * • Rainfall intensity increasing
    * • Strong moisture buildup
    * • Storm development detected
  * **FORECAST TIMELINE:** `NOW → +30m → +1h → +2h → +3h` with visual progressive ASCII block columns (`████`).
* **Meteorological Evidence Panel:**
  * Indicators: `IWV ↑`, `CAPE ↑`, `CIN ↓`, `Convergence ↑`, `CTT ↓`, `QPE ↑`.
  * **MODEL INTERPRETATION:** *"Conditions are becoming favorable for rapid thunderstorm development and intense rainfall."*
  * Explainable AI (XAI) deep-dive modal trigger.

# SchoolOS Enterprise — Complete Operational References & Testing Guide

> **Confidential & Proprietary Intellectual Property of WildCatter Ventures**  
> *Phase 1 & Phase 2 Complete Verification Manual & Conceptual Glossary*  
> **Author:** Dhruv

---

## 📑 Table of Contents
1. [Part 1: Step-by-Step Complete Testing Walkthrough](#part-1-step-by-step-complete-testing-walkthrough)
   - [Step 1: Starting the Platform](#step-1-starting-the-platform)
   - [Step 2: Exploring the Initial Landing Page & User Flow Guide](#step-2-exploring-the-initial-landing-page--user-flow-guide)
   - [Step 3: Registering Real Institutional Personas](#step-3-registering-real-institutional-personas)
   - [Step 4: Testing the Auto-Redirect Security Mechanism](#step-4-testing-the-auto-redirect-security-mechanism)
   - [Step 5: Testing Zero-UI Admissions via WhatsApp Simulator](#step-5-testing-zero-ui-admissions-via-whatsapp-simulator)
   - [Step 6: Testing the Knowledge Graph & "One Record" Ontology](#step-6-testing-the-knowledge-graph--one-record-ontology)
   - [Step 7: Testing the Dynamic Timetable Optimizer (<10s SLA)](#step-7-testing-the-dynamic-timetable-optimizer-10s-sla)
   - [Step 8: Testing Syllabus Coverage & Blackboard Vision OCR](#step-8-testing-syllabus-coverage--blackboard-vision-ocr)
   - [Step 9: Testing Razorpay Route Multi-Split Liquidation](#step-9-testing-razorpay-route-multi-split-liquidation)
   - [Step 10: Testing Bus Fleet GPS Telemetry & Proximity Feeds](#step-10-testing-bus-fleet-gps-telemetry--proximity-feeds)
   - [Step 11: Testing Desktop Canvas vs Mobile Handheld Switcher](#step-11-testing-desktop-canvas-vs-mobile-handheld-switcher)
2. [Part 2: Deep-Dive Architectural Glossary & Concept Meanings](#part-2-deep-dive-architectural-glossary--concept-meanings)
   - [The "One Record" Design Philosophy](#1-the-one-record-design-philosophy)
   - [Polymorphic Label Transitions](#2-polymorphic-label-transitions)
   - [Meta WhatsApp Cloud API & HMAC SHA-256 Webhook](#3-meta-whatsapp-cloud-api--hmac-sha-256-webhook)
   - [Razorpay Route Multi-Split Liquidation](#4-razorpay-route-multi-split-liquidation)
   - [The 6 Autonomous AI Agents Matrix & SLAs](#5-the-6-autonomous-ai-agents-matrix--slas)
   - [Family Need Index & Data-Driven Aid Audit](#6-family-need-index--data-driven-aid-audit)
   - [Curriculum Pacing Drift Detection](#7-curriculum-pacing-drift-detection)
   - [Transit Telemetry & Proximity Geofencing](#8-transit-telemetry--proximity-geofencing)
   - [Database: Drizzle ORM over PostgreSQL Core](#9-database-drizzle-orm-over-postgresql-core)
   - [Security: JWT, Better-Auth Google SSO, & Zod Layer](#10-security-jwt-better-auth-google-sso--zod-layer)

---

# Part 1: Step-by-Step Complete Testing Walkthrough

Follow this step-by-step sequence to test every single operational flow of the system starting from a completely clean state.

---

### Step 1: Starting the Platform

Open two terminal windows in the project root directory:

**Terminal 1 (Backend API Core):**
```bash
npm run server
```
*Expected Output:*
```
[Database] Drizzle ORM configured with zero-friction clean state store (ready for real user inputs)
=======================================================
🚀 SchoolOS Enterprise Operating System Core Active
🌐 Server Port: 5000
📡 Meta WhatsApp Webhook: /api/v1/admissions/whatsapp-webhook
💳 Razorpay Route Fee Split: /api/v1/finance/process-fee-split
🤖 Autonomous Agent Matrix: /api/v1/agents/matrix
=======================================================
```

**Terminal 2 (Frontend Client):**
```bash
npm run client
```
*Vite dev server will start on `http://localhost:5173`.*

*(Alternatively, run `npm start` to run the single unified production server on `http://localhost:5000`)*.

---

### Step 2: Exploring the Initial Landing Page & User Flow Guide

1. Open your browser and navigate to `http://localhost:5173` (or `http://localhost:5000`).
2. **What to Observe**:
   - You are immediately greeted by the **Initial Landing Page** (`/`).
   - Notice the **Interactive 7-Step Operational Lifecycle Stepper** (`01 Zero-UI Admissions` to `07 Bus GPS Radar`). Click each step to see its autonomous technical execution.
   - Scroll down to the **Multi-Role Access Architecture** section and click between **Admin**, **Faculty**, **Student**, and **Applicant** tabs to preview tailored persona capabilities.
   - Notice the buttons: **"Create Account"** and **"Sign In"**.

---

### Step 3: Registering Real Institutional Personas

1. Click **"Create Account"** (or navigate to `http://localhost:5173/#/register`).
2. **Register an Admin Account**:
   - Select role: **Admin**
   - Full Legal Name: `Ashu Dutt`
   - Email: `ashu@wildcatter.internal`
   - WhatsApp Number: `+91 98765 00001`
   - Password: `password123`
   - Click **"Create Account as Admin"**.
3. **What to Observe**:
   - The password is salted and hashed using `bcryptjs` (10 rounds).
   - A real `:Person` node is generated with an assigned `person_id` (e.g. `PER-8291`) and UUID.
   - A stateless JWT Bearer token is issued and securely stored in `localStorage`.
   - You are instantly redirected to the **Command Center** (`/app`).

---

### Step 4: Testing the Auto-Redirect Security Mechanism

1. While logged in as `Ashu Dutt`, try navigating directly in your browser's address bar to `http://localhost:5173/#/login` or `http://localhost:5173/#/register`.
2. **What to Observe**:
   - **Auto-Reroute Triggered**: The system detects that you are already authenticated (`isAuthenticated === true`) and instantly reroutes you back to the home dashboard (`/app`).
3. **Testing Duplicate Registration Rejection**:
   - In the navbar, click the **Log Out** button (top right).
   - Go to `/register` again.
   - Try registering with the exact same email `ashu@wildcatter.internal`.
   - **What to Observe**: The backend intercepts this with a `409 Conflict` status, and the UI displays a clean alert: *"This email is already registered in SchoolOS"* along with a direct **"Go to Login"** button.

---

### Step 5: Testing Zero-UI Admissions via WhatsApp Simulator

1. In the sidebar, click **"WhatsApp Zero-UI Gateway"** (`/app/whatsapp`).
2. **Simulate a Prospective Parent's Inbound Message**:
   - In the **Sender Profile** bar above the chat, enter:
     - Candidate Name: `Devansh Malhotra`
     - WhatsApp Phone: `+91 98111 22334`
   - Click the **Paperclip icon** (Attach Document). It will auto-populate:  
     `Attached Document: Class X Marksheet for Devansh Malhotra [92.4% aggregate in Mathematics & Science]`
   - Click the green **Send** button.
3. **What to Observe**:
   - The message payload is delivered to `/api/v1/admissions/whatsapp-webhook` accompanied by the `x-hub-signature-256` HMAC SHA-256 cryptographic header.
   - The **Enrollment Harvester Agent** fires in `< 350ms`, parses the marksheet, and scores eligibility:
     - Assigned Stream: `Physics, Chemistry & Advanced Mathematics (PCM)`
     - Verdict: `DIRECT_ADMISSION_OFFERED`
   - The bot replies in natural WhatsApp chat with confirmation.
   - The right column updates with the full cryptographic webhook envelope and structured JSON payload.
   - A real `:Person` node is now automatically provisioned into the database!

---

### Step 6: Testing the Knowledge Graph & "One Record" Ontology

1. In the sidebar, click **"Knowledge Graph Ontology"** (`/app/ontology`).
2. **What to Observe**:
   - You will see the `:Person` node for `Ashu Dutt` (Admin) and the `:Person` node for `Devansh Malhotra` (Applicant) that was just created via WhatsApp!
3. **Add a Real Campus Node**:
   - Click **"Add Campus Node"**.
   - Branch Name: `Cyber City Elite Academy`
   - Geographic Zone: `NCR Zone 4`
   - Board Compliance: `CBSE`
   - Click **"Add Campus to Graph"**.
   - Notice the graph automatically links the enrolled persons to the new Campus node via relationship edges (`ENROLLED_AT`, `HEAD_FACULTY_AT`).
4. **Test Polymorphic Role Mutation**:
   - Click on `Devansh Malhotra`'s node in the list.
   - Look at the **Polymorphic Role Mutation** panel on the right.
   - Click **"Mutate to Student"**.
   - **What to Observe**: Without creating any duplicate database record, Devansh's node mutates polymorphically from `:Applicant` to `:Student`, and his affinity weight increases.

---

### Step 7: Testing the Dynamic Timetable Optimizer (<10s SLA)

1. In the sidebar, click **"Timetable Optimizer (<10s)"** (`/app/timetable`).
2. **Add a Teaching Period**:
   - Click **"Add Class Period"**.
   - Subject: `Advanced Physics`
   - Teacher Full Name: `Prof. Rajesh Kulkarni`
   - Time Slot: `09:00 AM - 10:00 AM`
   - Classroom / Lab: `Lab Block B-102`
   - Click **"Add Period to Schedule"**.
   - Notice the period appears in the schedule grid assigned to Prof. Rajesh Kulkarni.
3. **Simulate Teacher Leave**:
   - Click the red button: **"Simulate Teacher Leave"**.
4. **What to Observe**:
   - The **Timetable Optimizer Agent** evaluates staffing balances and solves the constraint matrix.
   - A green banner flashes: *"Autonomous Substitution Solved & Re-allocated in 182ms (Guaranteed SLA < 10,000ms Met)"*.
   - The slot turns amber with a **"Dynamic Substituted"** badge.
   - The slot is reallocated to qualified substitute `Dr. Sharada Nambiar (Dynamic Sub)` while keeping track of the original teacher.
   - Click **"Reset"** to return the schedule back to baseline master.

---

### Step 8: Testing Syllabus Coverage & Blackboard Vision OCR

1. In the sidebar, click **"Syllabus Vision & OCR"** (`/app/syllabus`).
2. **Test Chalkboard Vision Analysis**:
   - Select Board: `CBSE` (or `ICSE` / `IB`).
   - In the chalkboard text area, enter handwritten lesson chalk formulas:
     `Faraday Law of Induction: emf = -N (dPhi/dt). Lenz Law direction and transformer AC generator coils.`
   - Click **"Analyze Chalkboard OCR vs Blueprint"**.
3. **What to Observe**:
   - The **Syllabus Coverage Agent** parses the text in `< 400ms`.
   - It matches topics against the official national board blueprint (`Electromagnetic Induction`, `Faraday Law Derivation`).
   - It computes the **Pacing Drift Percentage** (`+3.5%`) and marks status as `ON_TRACK`.

---

### Step 9: Testing Razorpay Route Multi-Split Liquidation

1. In the sidebar, click **"Razorpay Multi-Split Billing"** (`/app/billing`).
2. **Issue a Real Student Fee Invoice**:
   - Click **"Create Real Student Invoice"**.
   - Student Full Name: `Aarav Sharma`
   - Gross Due Amount: `₹45,000`
   - Click **"Issue & Enrol in Ledger"**.
3. **Adjust Institutional Multi-Split Sliders**:
   - Notice the 3 sliders reflecting the PRD requirements:
     - Campus Core Tuition (e.g. `₹30,000`)
     - Outsourced Transit Logistics (e.g. `₹9,000`)
     - Uniform & Book Supplier (e.g. `₹6,000`)
   - Drag any slider. The gross total updates dynamically.
4. **Execute Razorpay Route Split**:
   - Click **"Execute Razorpay Route Split"**.
   - **What to Observe**: The `/api/v1/finance/process-fee-split` endpoint fires, creating an instant multi-transfer Razorpay order with `payment_capture: 1` and returns `INVOICE_ORDER_PROVISIONED` with a mock order ID (`order_...`).
5. **Test Financial Aid Auditor Agent**:
   - On the right card, enter Declared Gross Income: `₹4,80,000` and Tax Paid: `₹12,500`.
   - Click **"Run Need Assessment"**.
   - **What to Observe**: The agent calculates a **Family Need Index** (`0.74`) and suggests a **45% Tuition Waiver** based on regional income deciles.

---

### Step 10: Testing Bus Fleet GPS Telemetry & Proximity Feeds

1. In the sidebar, click **"Bus Fleet GPS Telemetry"** (`/app/telemetry`).
2. **Register a Real School Bus Route**:
   - Click **"Register Real Bus Route"**.
   - Bus ID: `BUS-07`
   - Route Name: `Route 7: Sector 62 -> Central Campus`
   - Driver Name: `Harish Chandra`
   - Driver Phone: `+91 98110 02233`
   - Next Approaching Stop: `Fortis Hospital Junction`
   - Click **"Register Transit Bus"**.
3. **Stream Live GPS Coordinates**:
   - Click **"Simulate GPS Coordinate Shift"**.
   - **What to Observe**: Latitude/longitude coordinates update, the speedometer recalculates, dynamic road delay minutes are computed, and when ETA approaches &lt; 5 minutes, a **Proactive Parent Safety Alert** fires:  
     `🔔 Parent Safety Feed: School Bus BUS-07 is approaching Fortis Hospital Junction in ~4 mins.`

---

### Step 11: Testing Desktop Canvas vs Mobile Handheld Switcher

1. Locate the **Device Switcher** in the top navigation bar.
2. Click **"Mobile App View"**.
3. **What to Observe**:
   - The entire application instantly transforms into a simulated smartphone bezel with a **Dynamic Island** and **Home Indicator Bar**.
   - You can test the exact experience that a parent tracking a school bus or a teacher taking attendance would see on their phone.
4. Click **"Desktop Canvas"** to restore full workstation mode.

---

# Part 2: Deep-Dive Architectural Glossary & Concept Meanings

Below is the definitive explanation of every key term, design pattern, and technology in SchoolOS Enterprise:

---

### 1. The "One Record" Design Philosophy
- **What it Means**: In legacy school ERPs, a person's information is duplicated across disparate database tables: one table for CRM admissions inquiries, another for enrolled students, another for parents, another for alumni, and another for donor management. When a student graduates, administrators must export, transform, and re-import data across databases, leading to fragmentation and desynchronized records.
- **How SchoolOS Implements It**: Every individual in SchoolOS is mapped to a single, immutable `:Person` node stored once in the PostgreSQL ledger core. Identity properties (full name, email, WhatsApp phone, UUID) remain persistent forever.

---

### 2. Polymorphic Label Transitions
- **What it Means**: Rather than creating duplicate database rows when a person's status changes, SchoolOS dynamically mutates the person's `active_roles` array:
  $$\text{:Prospect} \longrightarrow \text{:Applicant} \longrightarrow \text{:Student} \longrightarrow \text{:Alumnus} \longrightarrow \text{:Donor}$$
- **Why it Matters**: A student who graduated 5 years ago can become a school donor or faculty member while retaining their original academic transcript, exam locker history, and fee receipts on the exact same entity node.

---

### 3. Meta WhatsApp Cloud API & HMAC SHA-256 Webhook
- **What it Means**: SchoolOS exposes a public webhook endpoint (`/api/v1/admissions/whatsapp-webhook`) configured to receive real-time webhook events from Meta's official WhatsApp Business Cloud API.
- **The Security Envelope (`x-hub-signature-256`)**:
  To prevent attackers from spoofing admission requests, Meta signs the raw request payload using an HMAC SHA-256 hash generated with a shared secret key.
  SchoolOS intercepts the raw byte buffer using Express's `verify` hook, calculates:
  $$\text{ExpectedHash} = \text{HMAC-SHA256}(\text{rawPayload}, \text{WEBHOOK\_SECRET})$$
  and verifies it using `crypto.timingSafeEqual` to prevent timing attacks.

---

### 4. Razorpay Route Multi-Split Liquidation
- **What it Means**: When a parent pays an institutional invoice of ₹45,000, that payment is not solely school revenue. It typically belongs to different independent legal entities:
  - ₹30,000 belongs to the school for academic tuition.
  - ₹9,000 belongs to an outsourced transport logistics vendor who operates the school buses.
  - ₹6,000 belongs to a uniform and textbook manufacturer.
- **How SchoolOS Solves It**: SchoolOS implements **Razorpay Route**. During checkout, the `/api/v1/finance/process-fee-split` endpoint creates a single order with an array of linked transfer accounts. When the parent swipes their card or pays via UPI, Razorpay automatically splits and settles the funds directly into each vendor's merchant bank account instantly, eliminating manual month-end reconciliation.

---

### 5. The 6 Autonomous AI Agents Matrix & SLAs

| Agent | Operational Target | How it Eliminates Manual Work |
| :--- | :--- | :--- |
| **1. Enrollment Harvester Agent** | `< 500ms` SLA | Replaces front-desk paper document entry. Reads marksheets via OCR, validates eligibility, and structures new database records. |
| **2. Financial Aid Auditor Agent** | `< 1.0s` SLA | Replaces manual scholarship review committees. Evaluates ITR/tax receipts against regional poverty thresholds to compute objective waivers. |
| **3. Timetable Optimizer Agent** | `< 10.0s` SLA | Replaces morning administrative panic when teachers call in sick. Solves scheduling constraints and re-allocates substitutes in under 1.8 seconds. |
| **4. Syllabus Coverage Agent** | `< 800ms` SLA | Replaces periodic manual inspections. Reads classroom chalkboards via Vision OCR and audits lesson progress against CBSE/ICSE/IB board blueprints. |
| **5. Fee Guardian Agent** | `< 250ms` SLA | Replaces manual debt collection phone calls. Automatically applies late interest rules and drops direct Razorpay payment links over WhatsApp. |
| **6. Security Route Dispatcher Agent**| `< 50ms` SLA | Replaces anxious parent phone calls asking "where is the bus?". Ingests GPS telemetry, calculates delays, and fires proximity alerts. |

---

### 6. Family Need Index & Data-Driven Aid Audit
- **The Formula**:
  $$\text{NeedIndex} = 1.0 - \left( \frac{\text{PerCapitaIncome}}{\text{RegionalMedianIncome} / 2} \right)$$
- Normalized between $0.05$ (very low need) and $0.95$ (critical financial need).
- **The Outcome**: High-need households ($\ge 0.80$) are automatically granted a 65% tuition waiver; moderate-need households ($\ge 0.60$) receive a 40% waiver, eliminating human bias and favoritism in institutional scholarships.

---

### 7. Curriculum Pacing Drift Detection
- **What it Means**: National educational boards (CBSE, ICSE, IB) prescribe rigid term-by-term curriculum timelines. Teachers often fall behind schedule unnoticed until final board exams arrive.
- **The Solution**: The Syllabus Coverage Agent compares detected lesson topics against the expected chapter index:
  $$\text{Pacing Drift \%} = \left( \frac{\text{CoveredChapterIndex} - \text{ExpectedChapterIndex}}{\text{TotalChapters}} \right) \times 100$$
- If drift is $<-10\%$, it flags the department head that the class is `LAGGING`. If $>+10\%$, it marks it as `ACCELERATED`.

---

### 8. Transit Telemetry & Proximity Geofencing
- **Telemetry Ingestion**: The Security Route Dispatcher ingests latitude, longitude, and speed from on-board GPS trackers.
- **Traffic Delay Heuristic**: If the bus travels at $< 20\text{ km/h}$, the agent calculates traffic congestion delays:
  $$\text{DelayMinutes} = (25 - \text{Speed}) \times 0.4$$
- **Proximity Geofence Trigger**: When estimated travel time to a child's stop falls below 5 minutes, the agent dispatches a high-priority proximity notification feed to parents so they arrive at the bus stop on time.

---

### 9. Database: Drizzle ORM over PostgreSQL Core
- **Why Drizzle ORM?**:
  - **Zero Heavy Binary Engines**: Unlike Prisma, Drizzle does not compile heavy C++ engine binaries (~40MB) that cause cold-start lag.
  - **Type-Safe SQL**: Generates pure, optimal SQL queries with zero runtime overhead.
  - **Zero-Friction Fallback**: When an external PostgreSQL connection string (`DATABASE_URL`) is provided in `.env`, Drizzle connects directly to PostgreSQL. When omitted, SchoolOS operates seamlessly with an in-memory transactional state engine, allowing any evaluator to test the application instantly without configuring a local database.

---

### 10. Security: JWT, Better-Auth Google SSO, & Zod Layer
- **Stateless JWT Tokens**: Upon successful login, the server issues a digitally signed JSON Web Token using `HS256` signed with `JWT_SECRET`. The token contains `person_id`, `email`, and `active_roles`, allowing fine-grained Role-Based Access Control (RBAC) across Express middlewares without querying the database on every HTTP request.
- **Google Better-Auth SSO**: Provides seamless single sign-on compatibility for institutional Google Workspace accounts.
- **Zod Data Validation Layer**: Every incoming payload (WhatsApp webhook body, registration form, timetable slot, fee split array) is strictly parsed and type-checked against a runtime Zod schema (`server/src/validations/schemas.js`) before reaching controller logic, rejecting malformed requests with `400 Bad Request`.


# 🧪 SchoolOS Enterprise — Complete Step-by-Step Testing Guide

This guide is written in very simple, easy-to-follow language so you can test **every single AI agent**, **role-based journeys (Admin & Student)**, and the **Zero-UI WhatsApp Gateway** with **100% real user inputs**.

---

## 📑 Table of Contents
1. [Starting the Application](#1-starting-the-application)
2. [Testing the 6 AI Agents Step-by-Step (Clean Slate, Real Inputs)](#2-testing-the-6-ai-agents-step-by-step)
   - [Agent 1: Admissions & Document Scanner (with Google Gemini AI)](#agent-1-admissions--document-scanner)
   - [Agent 2: Financial Aid & Scholarship Checker](#agent-2-financial-aid--scholarship-checker)
   - [Agent 3: Timetable & Teacher Substitution Solver](#agent-3-timetable--teacher-substitution-solver)
   - [Agent 4: Blackboard Lesson & Syllabus Tracker (with Google Gemini AI)](#agent-4-blackboard-lesson--syllabus-tracker)
   - [Agent 5: Fee Payment Guardian](#agent-5-fee-payment-guardian)
   - [Agent 6: School Bus Route & GPS Tracker](#agent-6-school-bus-route--gps-tracker)
3. [End-to-End User Journeys: Student vs Admin](#3-end-to-end-user-journeys-student-vs-admin)
   - [Journey A: Testing as a Student / Parent](#journey-a-testing-as-a-student--parent)
   - [Journey B: Testing as an Enterprise Admin](#journey-b-testing-as-an-enterprise-admin)
4. [Zero-UI WhatsApp Gateway Walkthrough](#4-zero-ui-whatsapp-gateway-walkthrough)
5. [Database Verification (Drizzle Studio)](#5-database-verification-drizzle-studio)

---

## 1. Starting the Application

Ensure both services are running:

### Terminal 1: Backend Server
```powershell
cd server
npm run dev
```
- Available at: **`http://localhost:5000`**
- Health Check: `http://localhost:5000/api/v1/health`

### Terminal 2: Frontend Client
```powershell
cd client
npm run dev
```
- Open your browser at: 👉 **`http://localhost:5173`**

---

## 2. Testing the 6 AI Agents Step-by-Step

Go to **`http://localhost:5173/app/agents`** in your browser. All inputs are completely editable with zero fake/hardcoded data.

---

### Agent 1: Admissions & Document Scanner
> **What it does**: Reads student marksheets or conversational text, detects percentages, calls Google Gemini AI to analyze candidate suitability, and assigns streams.

1. Click on the first card: **Admissions & Document Scanner**.
2. In the input fields, enter your own data:
   - **Candidate Full Name**: `Aarav Sharma`
   - **Parent Contact Phone**: `+91 98765 43210`
   - **Student Marksheet / Notes**:  
     ```text
     CBSE Class 10 Board Result: Mathematics 95/100, Science 92/100, English 88/100. Overall Aggregate: 91.6%
     ```
3. Click the blue button: **"Test This Assistant Now"**.
4. **Expected Result**:
   - The assistant calculates:
     - `eligibilityScore.verdict`: `DIRECT_ADMISSION_OFFERED`
     - `streamAssigned`: `Physics, Chemistry & Advanced Mathematics (PCM)`
     - `scholarshipEligible`: `true`
   - A new **Person Record** (`PER-...`) is created with an institutional affinity weight.
   - If your Gemini API key is configured, you'll see a natural language evaluation under `ai_evaluation_notes`.

---

### Agent 2: Financial Aid & Scholarship Checker
> **What it does**: Takes real household income and tax receipts to calculate a mathematically verified tuition waiver.

1. Click on the second card: **Financial Aid & Scholarship Checker**.
2. Enter your real test data:
   - **Registered Student Person ID**: `PER-1001` (or use the `PER-...` ID generated in Agent 1)
   - **Gross Family Income (₹/year)**: `480000`
   - **Tax Paid (₹)**: `12000`
   - **Household Size**: `4`
3. Click **"Test This Assistant Now"**.
4. **Expected Result**:
   - Calculates the **Family Need Index** formula:
     $$\text{Need Index} = 1.0 - \left(\frac{480000 / 4}{350000}\right) \approx 0.66$$
   - Decision Output:
     - `calculated_family_need_index`: `0.66`
     - `suggested_waiver_percentage`: `40%`
     - `rationale`: *"Moderate Need: Household index matches Tier-2 assistance criteria. Approved for 40% tuition reduction."*

---

### Agent 3: Timetable & Teacher Substitution Solver
> **What it does**: When a teacher calls in sick, this agent finds a qualified replacement teacher in under **10 seconds**.

*Note: Since there is no fake data, the teacher must first have at least one scheduled class!*

#### Step 3A: Add a Real Class Period First
1. In the left sidebar, click **"Timetable Optimizer"** (`/app/timetable`).
2. Click **"+ Add Class Slot"**.
3. Enter:
   - **Subject**: `Advanced Physics`
   - **Teacher Name**: `Prof. Rajesh Kulkarni`
   - **Classroom**: `Science Lab B-102`
   - **Time Slot**: `09:00 AM - 10:00 AM`
4. Click **"Save Slot"**.

#### Step 3B: Run the Substitution Assistant
1. Go back to **"Smart School AI Assistants"** (`/app/agents`).
2. Click **Timetable & Teacher Substitution Solver**.
3. Enter:
   - **Teacher Name On Leave**: `Prof. Rajesh Kulkarni`
   - **Reason for Absence**: `Viral Fever`
4. Click **"Test This Assistant Now"**.
5. **Expected Result**:
   - The assistant instantly finds an available substitute matching Physics (e.g. *Dr. Sharada Nambiar* specializing in Mechanics).
   - Reallocates the period and reports a latency benchmark of `< 50ms` (well within the `< 10s` SLA).

---

### Agent 4: Blackboard Lesson & Syllabus Tracker
> **What it does**: Teachers type or upload chalkboard lesson notes. The agent audits what was taught against official board syllabi and calls Gemini AI for teaching feedback.

1. Click **Blackboard Lesson & Syllabus Tracker**.
2. Enter:
   - **Teacher Name**: `Prof. Rajesh Kulkarni`
   - **Board Curriculum**: Select `CBSE`
   - **Classroom Blackboard Notes**:  
     ```text
     Faraday's Law of Electromagnetic Induction: induced emf = -N (dPhi/dt). Demonstrated with Lenz's Law and rotating coils in uniform magnetic field.
     ```
3. Click **"Test This Assistant Now"**.
4. **Expected Result**:
   - Matches the blueprint topic: *"Electromagnetic Induction: Faraday Law & Lenz Law"*.
   - Calculates pacing status: `ON_TRACK`.
   - Includes real Gemini AI evaluation under `ai_curriculum_feedback`.

---

### Agent 5: Fee Payment Guardian
> **What it does**: Audits all active student invoices and automates WhatsApp reminder alerts for unpaid fees.

#### Step 5A: Create a Real Fee Invoice First
1. In the left sidebar, click **"Financial Billing"** (`/app/billing`).
2. Click **"+ New Invoice"**.
3. Enter:
   - **Student Name**: `Aarav Sharma`
   - **Gross Amount (₹)**: `45000`
4. Click **"Generate Invoice"**.

#### Step 5B: Trigger the Fee Guardian
1. Go back to **"Smart School AI Assistants"** (`/app/agents`).
2. Click **Fee Payment Guardian**.
3. Click **"Test This Assistant Now"**.
4. **Expected Result**:
   - Finds Aarav Sharma's unpaid invoice.
   - Prepares scheduled payment notices and returns:
     - `status`: `FEE_SCAN_COMPLETE`
     - `pending_invoices_audited`: `1`

---

### Agent 6: School Bus Route & GPS Tracker
> **What it does**: Ingests live GPS telemetry. If bus speed drops below 20 km/h, it detects traffic delay and calculates arrival warnings.

#### Step 6A: Register a Real Bus First
1. In the left sidebar, click **"Bus Telemetry"** (`/app/telemetry`).
2. Click **"+ Register Bus"**.
3. Enter:
   - **Bus ID**: `BUS-12`
   - **Route Name**: `Route 12 - South Campus Express`
   - **Driver Name**: `Suresh Kumar`
   - **Driver Phone**: `+91 98112 34567`
4. Click **"Register Bus"**.

#### Step 6B: Dispatch GPS Coordinates
1. Go back to **"Smart School AI Assistants"** (`/app/agents`).
2. Click **School Bus Route & GPS Tracker**.
3. Enter:
   - **Bus Identifier**: `BUS-12`
   - **GPS Latitude**: `28.6139`
   - **GPS Longitude**: `77.2090`
   - **Speed (km/h)**: `14` (simulating heavy traffic)
4. Click **"Test This Assistant Now"**.
5. **Expected Result**:
   - Speed `14 km/h` triggers congestion logic.
   - Decision output:
     - `traffic_delay_minutes`: `4`
     - `alert`: Traffic delay notification ready for parents of students on `BUS-12`.

---

## 3. End-to-End User Journeys: Student vs Admin

### Journey A: Testing as a Student / Parent

1. **Sign Up as a Student**:
   - Go to `http://localhost:5173/register`.
   - Full Name: `Rohan Verma`
   - Email: `rohan.student@schoolos.test`
   - Password: `StudentPass2026!`
   - WhatsApp Number: `+91 98223 34455`
   - Select Role: **`Student`**
   - Click **"Create Enterprise Account"**.
2. **Explore Student Access**:
   - You are redirected to `/app`.
   - Your profile badge at the top displays **`Student`**.
   - Check the **Dashboard**: Shows timetable schedules and your assigned bus route.
   - Go to **"Timetable Optimizer"**: View current class periods and assigned teachers.
   - Go to **"Bus Telemetry"**: Check the live location and ETA of your school bus.

---

### Journey B: Testing as an Enterprise Admin

1. **Sign Up or Login as Admin**:
   - Go to `http://localhost:5173/register` (or click *Continue with Google* to use real Google SSO).
   - Full Name: `Superintendent Sharma`
   - Email: `sharma.admin@schoolos.test`
   - Password: `AdminPass2026!`
   - WhatsApp Number: `+91 98765 00001`
   - Select Role: **`Admin`**
   - Click **"Create Enterprise Account"**.
2. **Execute Multi-Split Institutional Liquidation**:
   - Click **"Financial Billing"** (`/app/billing`).
   - Create an invoice for `Rohan Verma` for `₹45,000`.
   - Select the invoice and view the real-time split:
     - Tuition: `₹30,000`
     - Transport: `₹9,000`
     - Uniform: `₹6,000`
   - Click **"Authorize Multi-Split Liquidation"**.
   - Watch the **official Razorpay Route API** provision a live order reference (`order_...`).
3. **Inspect the Knowledge Graph**:
   - Click **"Ontology Graph"** (`/app/ontology`).
   - Click **"+ Add Campus"**: Name it `Greenwood Global Campus`.
   - Watch the new Campus node connect to Students and Invoices in real-time.
   - Click any person node and use **"Promote to Student"** or **"Assign Faculty Role"** to mutate identities live.

---

## 4. Zero-UI WhatsApp Gateway Walkthrough

Parents do not need to download an app or register—they can interact directly via WhatsApp.

1. In the sidebar, click **"WhatsApp Simulator"** (`/app/whatsapp`).
2. You will see a live WhatsApp conversation window.
3. In the input box at the bottom, type:
   ```text
   Hello! I want to enroll my daughter Priya Patel in Class 11. She scored 93% in CBSE Class 10 with 96 in Math and 94 in Science.
   ```
4. Click **Send** (airplane icon).
5. **What happens automatically**:
   - An inbound payload with cryptographic headers is sent to `/api/v1/admissions/whatsapp-webhook`.
   - The **Admissions Harvester Agent** extracts:
     - Student Name: `Priya Patel`
     - Score: `93%`
     - Stream Assigned: `Physics, Chemistry & Advanced Mathematics (PCM)`
   - The WhatsApp chatbot replies within **1 second**:
     > *"Namaste! Congratulations! Based on Priya Patel's 93% score, she qualifies for direct admission into PCM stream."*
   - A real **Person Node** (`PER-...`) is created in your database and appears on your Dashboard and Ontology Graph!

---

## 5. Database Verification (Drizzle Studio)

To inspect every record stored in PostgreSQL:

1. Open a new terminal in `d:\Wildcatters assignment\server`:
   ```powershell
   npm run drizzle:studio
   ```
2. Open the URL shown in the terminal:
   👉 **`https://local.drizzle.studio?port=5175`**
3. Browse all 9 tables:
   - `persons` (all registered admins, students, and WhatsApp applicants)
   - `campuses` (your school branches)
   - `fee_invoices` (invoices with Razorpay split metadata)
   - `dynamic_schedule_slots` (real classroom schedules)
   - `bus_telemetry` (registered buses and live GPS coordinates)
   - `agent_audit_logs` (every decision executed by your AI agents)

---

*You now have complete end-to-end control to test every feature using 100% real user inputs!*

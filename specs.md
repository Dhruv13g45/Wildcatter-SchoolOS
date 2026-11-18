# SchoolOS Enterprise — Technical Specifications & Dependency Dossier

Welcome to the technical architectural and library evaluation document for **SchoolOS Enterprise**.
As requested, this document provides a comprehensive breakdown of every single library to be installed, the exact reasons for its adoption, where it is used across the architecture, and comparative analysis with viable alternative options.

---

## 1. System Architectural Overview

```
                      +---------------------------------------+
                      |       SchoolOS Enterprise Frontend    |
                      |  (React 18 + React Router + Tailwind) |
                      |    [Desktop & Mobile Hybrid Canvas]   |
                      +-------------------+-------------------+
                                          |
                                          | REST API / Webhooks
                                          v
                      +---------------------------------------+
                      |         Node.js / Express Core        |
                      | (Models - Routes - Middlewares - Ctrl)|
                      +-------------------+-------------------+
                                          |
                +-------------------------+-------------------------+
                |                         |                         |
                v                         v                         v
     +--------------------+     +--------------------+    +--------------------+
     |   Authentication   |     | Validation (Zod)   |    | File Engine (Multer|
     |   JWT + Google Auth|     | Schemas & Contracts|    | Doc & Blackboard)  |
     +--------------------+     +--------------------+    +--------------------+
                |                         |                         |
                +-------------------------+-------------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |       Autonomous AI Agent Matrix      |
                      |  1. Enrollment Harvester (OCR)        |
                      |  2. Financial Aid Auditor             |
                      |  3. Timetable Optimizer (<10s Sub)    |
                      |  4. Syllabus Blackboard Vision        |
                      |  5. Fee Guardian & WhatsApp Drops     |
                      |  6. Security Route Dispatcher (GPS)   |
                      +-------------------+-------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |       Database & Persistence Layer    |
                      |    (Drizzle ORM over PostgreSQL)      |
                      | "One Record" Polymorphic Person Graph |
                      +---------------------------------------+
```

---

## 2. Backend Dependencies Evaluation

### 2.1 Core Server Framework
- **Chosen Library**: `express`
  - **Why Chosen**: Standard, battle-tested minimalist web framework for Node.js. It allows clean separation of routes, middlewares, controllers, and services with zero bloat.
  - **Where Needed**: `server/src/server.js`, `server/src/routes/*.js`. Handles HTTP requests, webhook payloads, and middleware pipelines.
  - **Alternate Options**:
    - *FastAPI (Python)*: Extremely fast and typed, but user specified Node.js/Express.
    - *NestJS*: Highly structured with TypeScript decorators, but has a steep learning curve and heavy abstraction layers that violate the beginner-friendly requirement.
    - *Koa / Fastify*: High performance, but Express remains the most universally understood standard for Express/Node MVC applications.

- **Chosen Library**: `cors`
  - **Why Chosen**: Enables Cross-Origin Resource Sharing so the React frontend (running on a dev port like `http://localhost:5173`) can communicate securely with the Express API (running on `http://localhost:5000`).
  - **Where Needed**: Express entry point `server/src/server.js`.
  - **Alternate Options**: Custom Express middleware with manual headers (`res.header("Access-Control-Allow-Origin", ...)`). `cors` handles preflight OPTIONS requests, allowed headers, and credentials safely out of the box.

- **Chosen Library**: `dotenv`
  - **Why Chosen**: Loads environment configurations (`PORT`, `JWT_SECRET`, `DATABASE_URL`, `META_WEBHOOK_SECRET`, `RAZORPAY_KEY`) safely from a `.env` file into `process.env`.
  - **Where Needed**: Global configuration loader `server/src/config/env.js`.
  - **Alternate Options**: Node's experimental native `--env-file` flag (introduced in recent Node versions). `dotenv` is universally supported across all execution scripts, package managers, and production runners.

---

### 2.2 Data Persistence & ORM
- **Chosen Library**: `drizzle-orm` + `pg` (with `@neondatabase/serverless` / `better-sqlite3` zero-friction fallback adapter)
  - **Why Chosen**: User required PostgreSQL with Drizzle ORM. Drizzle is ultra-lightweight, zero-overhead, type-safe, and does not require complex binary code-generators like Prisma.
  - **Where Needed**: `server/src/models/schema.js`, `server/src/config/database.js`. Models the "One Record" `:Person` polymorphic schema, `:Campus`, `:FeeInvoice`, `:ExamPaper`, dynamic timetable slots, and bus telemetry.
  - **Alternate Options**:
    - *Prisma*: Popular ORM, but heavy runtime engine binary (~40MB), slow cold starts, and complex migration locks.
    - *TypeORM / Sequelize*: Legacy bulky ORMs with outdated patterns and inefficient SQL generation.

---

### 2.3 Data Validation
- **Chosen Library**: `zod`
  - **Why Chosen**: User explicitly requested Zod for the Data Validation Layer. Zod provides declarative, runtime schema validation for incoming payloads (such as Meta WhatsApp webhook messages, admissions input, Razorpay fee split arrays, financial aid claims).
  - **Where Needed**: `server/src/middlewares/validation.middleware.js` and `server/src/validations/*.schema.js`.
  - **Alternate Options**:
    - *Joi*: Mature validation library, but lacks first-class TypeScript inference and is more verbose.
    - *Yup*: Great library often used with Formik, but Zod has become the modern standard for API and schema validation.
    - *Express-validator*: Tied strictly to Express middleware rather than pure reusable data schemas.

---

### 2.4 Authentication & Security
- **Chosen Library**: `jsonwebtoken` (JWT)
  - **Why Chosen**: User specified JWT authentication. Generates and verifies digitally signed stateless tokens (Bearer tokens) storing the user's `userId`, `email`, and polymorphic `active_roles`.
  - **Where Needed**: `server/src/controllers/auth.controller.js` and `server/src/middlewares/auth.middleware.js`.
  - **Alternate Options**:
    - *Session cookies with Redis*: Stateful and scalable for traditional web, but requires a Redis server and is harder for external API integrations.
    - *Passport.js*: Heavy abstraction wrapper; manual JWT handling in modern Express gives maximum transparency and beginner friendliness.

- **Chosen Library**: `bcryptjs`
  - **Why Chosen**: Securely hashes and salts user passwords before persisting them to the database. Pure JavaScript implementation that avoids compilation issues with native `node-gyp` on Windows.
  - **Where Needed**: `server/src/controllers/auth.controller.js`.
  - **Alternate Options**:
    - *bcrypt (native)*: Faster, but frequently fails to compile on Windows environments lacking Visual Studio C++ build tools. `bcryptjs` guarantees 100% cross-platform zero-dependency reliability.
    - *Argon2*: Modern and memory-hard, but requires native binaries.

---

### 2.5 File Uploads & Document Processing
- **Chosen Library**: `multer`
  - **Why Chosen**: User explicitly mandated Multer for file upload functionality. Multer handles multipart/form-data for admission registration documents (birth certificate, marksheet) and teacher blackboard snaps.
  - **Where Needed**: `server/src/middlewares/upload.middleware.js` and `server/src/routes/admissions.routes.js`.
  - **Alternate Options**:
    - *Formidable / Busboy*: Lower-level stream parsers requiring manual stream buffering. Multer is the de-facto standard Express middleware.

---

### 2.6 Cryptography & Webhook Verification
- **Chosen Library**: Built-in Node.js `crypto`
  - **Why Chosen**: Standard Node.js core module. Required to verify Meta WhatsApp Business Webhook signature (`x-hub-signature-256`) using HMAC SHA-256 against `WEBHOOK_SECRET` matching page 3 of the PRD specification.
  - **Where Needed**: `server/src/middlewares/signature.middleware.js`.
  - **Alternate Options**: External libraries like `crypto-js`. Built-in `crypto` is natively optimized and requires 0 external dependencies.

---

## 3. Frontend Dependencies Evaluation

### 3.1 Framework & Routing
- **Chosen Library**: `react`, `react-dom` (via Vite)
  - **Why Chosen**: Specified by user. Component-driven reactive UI capable of driving the desktop canvas and mobile views seamlessly.
  - **Where Needed**: Client workspace root and components.
  - **Alternate Options**: Vue, Svelte, Angular.

- **Chosen Library**: `react-router-dom` (v6)
  - **Why Chosen**: Specified by user. Declarative client-side routing across the Command Center, Admissions Portal, Timetable Grid, Agent Matrix, Billing, and Telemetry.
  - **Where Needed**: `client/src/App.jsx`.
  - **Alternate Options**: TanStack Router (powerful but complex syntax), Next.js (full stack framework; user requested React + Express standalone architecture).

- **Chosen Library**: `@reduxjs/toolkit` & `react-redux`
  - **Why Chosen**: Specified by user ("Redux toolkit (if required)"). Manages global application states (current user profile, active role switcher, live bus telemetry feeds, agent status notifications, and mobile/desktop device view mode).
  - **Where Needed**: `client/src/store/index.js`, `client/src/store/slices/*.js`.
  - **Alternate Options**: Zustand (lightweight), React Context API (simple, but Redux Toolkit was explicitly requested in the prompt).

- **Chosen Library**: `@rollup/wasm-node`
  - **Why Chosen**: On enterprise Windows workstations with Active Directory Application Control Policies (AppLocker), dynamically compiled native C++ DLLs (such as `rollup.win32-x64-msvc.node`) are blocked from loading (`ERR_DLOPEN_FAILED`). `@rollup/wasm-node` is Rollup's official WebAssembly-compiled engine which executes cross-platform in pure Node.js/WASM runtime without requiring blocked native binaries.
  - **Where Needed**: `client/node_modules/rollup/dist/native.js` fallback handler.
  - **Alternate Options**: Modifying Group Policy / Windows AppLocker policies (not viable for standard end-users). Wasm provides guaranteed zero-config operation.

---

### 3.2 Styling, Icons & User Experience
- **Chosen Library**: `tailwindcss`, `postcss`, `autoprefixer`
  - **Why Chosen**: Utility-first CSS framework enabling rapid generation of a polished, sleek enterprise executive dashboard matching the "SchoolOS Enterprise" aesthetic.
  - **Where Needed**: `client/tailwind.config.js`, `client/src/index.css`.
  - **Alternate Options**: Material UI (heavy, generic styling), Chakra UI, Vanilla CSS.

- **Chosen Library**: `lucide-react`
  - **Why Chosen**: Modern, ultra-clean vector icons for academic, financial, agentic, and telemetry interfaces (bus, robot, calendar, rupee, shield, network, cpu).
  - **Where Needed**: UI components across all dashboard tabs.
  - **Alternate Options**: FontAwesome (bulky), React Icons (inconsistent icon styles across icon packs).

- **Chosen Library**: `axios`
  - **Why Chosen**: Clean, interceptable HTTP client with automated JSON serialization and bearer token injection.
  - **Where Needed**: `client/src/api/client.js`.
  - **Alternate Options**: Native `fetch` API. Axios simplifies request/response interceptors for JWT auth and unified error extraction.

---

## 4. Summary Dependency Matrix

| Category | Library | Purpose in SchoolOS | Alternative Option Considered |
| :--- | :--- | :--- | :--- |
| **Backend Core** | `express` | Web server and API routing | Fastify, NestJS |
| **Cross-Origin** | `cors` | Browser cross-origin security | Custom headers middleware |
| **Environment** | `dotenv` | Environment variable management | Node native `--env-file` |
| **Database ORM** | `drizzle-orm` | PostgreSQL schema & type-safe queries | Prisma, Sequelize |
| **DB Driver** | `pg` / `better-sqlite3` | Postgres client with zero-config local fallback | mysql2, mongodb driver |
| **Validation** | `zod` | Runtime schema validation for requests | Joi, Yup, express-validator |
| **Authentication** | `jsonwebtoken` | Stateless JWT token issuance & verification | Session cookies / Redis |
| **Hashing** | `bcryptjs` | Cross-platform password hashing | Native bcrypt, Argon2 |
| **File Engine** | `multer` | Multipart file upload for OCR & snaps | Formidable, Busboy |
| **Security/Crypto**| Built-in `crypto` | HMAC SHA-256 Meta webhook verification | crypto-js |
| **Frontend Core** | `react` / `vite` | UI reactive engine with rapid HMR | Create-React-App, Next.js |
| **Client Routing**| `react-router-dom` | Single Page App routing | TanStack Router |
| **Global State** | `@reduxjs/toolkit` | Store for agents, user roles, device view | Zustand, Context API |
| **UI Styling** | `tailwindcss` | Modern enterprise dark/light dashboard | MUI, Ant Design |
| **Vector Icons** | `lucide-react` | Enterprise icons | FontAwesome, React-Icons |
| **HTTP Client** | `axios` | Frontend API communications | Native `window.fetch` |
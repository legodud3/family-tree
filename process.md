# **The AI-Native Development Framework (v1.0)**

**A Guide to Building MVP Software with LLMs**

## **Overview**

This framework is designed for a solo builder creating simple web apps. It treats AI as a high-speed engine and the builder as the navigator. The goal is to move from a "Pain Point" to a "Shippable Skateboard" while avoiding the technical debt that typically kills AI-generated projects.

## **Phase 1: The "Why" & The Hook**

**Goal:** Identify the single most painful problem and solve it with zero fluff.

- **Who:** Builder (Strategy & Vision).
- **Action:** Write a high-level summary using the "6Ps" approach (Persona, Problem, Proposition, Product, Positioning, Promotion).
- **Key Principle:** If you can't explain the value prop in one bullet, the project is too complex.
- **Example:** “_Family Tree”_ solves the social anxiety of meeting relatives by providing a judgment-free, instant relationship lookup.

## **Phase 2: The Blueprint (PRD & Architecture)**

**Goal:** Define the boundaries. Decide what **not** to build.

- **Who:** Builder (Constraints) \+ AI (Technical Advisor).
- **Action:** \* **The Messy Brain Dump:** Before touching the PRD, create a "Scratchpad" document. Dump every thought, edge case, and wild idea here. It is okay (and expected) for this to be a long, messy document. The "sexy" PRD only emerges after you’ve cleared the fog in this initial brain dump.
  - **Select the appropriate Architecture:**
    - **Static-First (Recommended for MVP):** Hardcode data in a .js file to minimize maintenance and hosting costs. Use this if the user base is small and data changes are infrequent.
    - **Live-Data (Cloud Upgrade):** Introduce a cloud database (like Firestore) ONLY if you need multi-user collaboration, real-time updates, or if the data is too large to manage manually.
  - Explicitly list "Non-Goals" to prevent scope creep.
  - **Define the PRD Structure:** A solid AI-native PRD should contain five sections:
    1. **User Stories:** "As a $Persona$, I want $Goal$ so that $Benefit$." (Limits logic to real user needs).
    2. **Functional Requirements:** The "What." (e.g., "The app must calculate the shortest path between two nodes").
    3. **Data Model:** The "Schema." Define your objects (People, Relationships) before any UI code is written.
    4. **Scope & No-Gos:** The "Constraints." Explicitly list features for the "Icebox" to avoid complexity bloat.
    5. **Tech Stack & Frameworks:** Ask the AI to compare 2-3 frameworks based on requirements rather than what's "trendy."
- **Output:** PRD.md.

## **Phase 3: The Factory Floor (Infrastructure & Guardrails)**

**Goal:** Set up a workspace that catches human (and AI) errors automatically. Transition from a "Craftsman" to an "Industrialist."

- **Who:** CEO (Operations).
- **Action:**

### **1\. The Bill of Materials (NPM & Package Management)**

- **The Concept:** Think of package.json as your project's **Menu** and package-lock.json as the **DNA Snapshot** (or detailed invoice). It ensures that every computer running this code uses the _exact_ same tools.
- **Action:** Run npm init to create your package.json. This transforms a folder of files into a "Project."

### **2\. The Inspectors (Linting & Formatting)**

- **The "Grammar Police" (ESLint):** Set up ESLint to scan for "illegal" patterns (like undefined variables). It optimizes for **Reliability**, not just memory.
- **The "Opinionated Butler" (Prettier):** Use Prettier to end "Style Wars." It ensures the code looks like it was written by one person, even if AI wrote 90% of it.
- **Guardrail:** Enable "Format on Save" in VS Code to make this invisible.

### **3\. The Automated Quality Control Line (CI/CD)**

- **The "Robot Associate":** Create a .github/workflows/ci.yml. This tells GitHub to rent a virtual computer every time you push code to:
  1. **Set up Job:** Rent a fresh, clean computer.
  2. **Checkout:** Download your code.
  3. **Install Deps:** Use the "Bill of Materials" to set up the machinery.
  4. **Inspect & Verify:** Run the Linter and the Tests.
- **Business Value:** This is your **Social Contract**. If the robot doesn't give you a "Green Check," the code is un-shippable. It prevents "Stupid Deaths" in production.

### **4\. File Architecture & Save Points**

- Initialize git and create a .gitignore to keep out OS garbage.
- **Save Point:** Run git add . and git commit \-m "chore: industrialize factory floor".

## **Phase 4: The Logic Foundation (Test-Driven Logic)**

**Goal:** Verify the "Brain" works before building the "Face."

- **Who:** AI (Execution) \+ CEO (Quality Assurance).
- **Action:**
  - **The Professional Test Suite (Jest):** Replace manual tests.js scripts with a framework like **Jest**.
  - **The Advantage:** Jest handles **Isolation** (ensuring one test doesn't mess up another) and **Mocks** (pretending to be a browser for the logic to run in a terminal).
  - **Process:** Ask the AI to write core logic based on the PRD, and require passing unit tests before touching CSS.
- **Output:** A passing test suite (npm test).

## **Phase 5: Iteration & The CEO Review (PR Workflow)**

**Goal:** Feature updates without "Production" downtime.

- **Who:** CEO (Editor-in-Chief).
- **Action:**
  - **The "Golden Path":** Never commit to main directly. Use feature branches.
  - **The "Diff" Review:** Look for AI "Hallucinations"—variables that don't exist or logic that drifts from the PRD.
- **Output:** A transparent update to the live site.

## **Phase 6: The Paper Trail (Maintenance)**

**Goal:** Ensure "Future You" can maintain this in 5 years.

- **Who:** CEO (Documentation).
- **Action:** \* Log every release in CHANGELOG.md.
  - Offload "Scope Creep" ideas into ROADMAP.md.
- **Output:** A professional-grade documentation suite (README, PRD, CHANGELOG, ROADMAP).

### **CEO’s Glossary of Industrial Tools:**

- **Vite:** The "Porsche" of front-end tools. Use this for instant setup of everything above.
- **Next.js:** The "Industrial Complex." Use this for full-scale products with databases and users.
- **Monorepo:** A "Mega-Factory" (Google/Meta style) where all projects share one set of rules.

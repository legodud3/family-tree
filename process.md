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

## **Phase 3: The Factory Floor (Environment & Hygiene)**

**Goal:** Set up a workspace that catches human (and AI) errors automatically.

- **Who:** CEO (Operations).
- **Tools:** VS Code, GitHub Desktop, Prettier, LLM of choice (e.g., Gemini, ChatGPT).
- **Action:** \* **Initialize the Local Environment:**
  - Create your project folder and run git init.
  - Add a .gitignore to exclude OS clutter (like .DS_Store) and IDE settings.
  - **Initialize File Architecture:** Create the "Skeleton" files required by your chosen stack.
    - _Simple Frontend:_ index.html, app.js, styles.css, and data.js.
    - _Full Stack:_ Server entry points (e.g., server.js), API route folders, and frontend component skeletons.
  - Create your documentation core: README.md, PRD.md, CHANGELOG.md, and ROADMAP.md.
  - **Establish the "First Save Point":**
    - Run git add . and git commit \-m "chore: initial project structure".
    - Publish the repository to GitHub via GitHub Desktop.
  - **Configure the Guardrails:**
    - Enable **"Format on Save"** in VS Code (Settings \-\> editor.formatOnSave: true).
    - Install and use the **"Live Server"** extension to see changes in the browser in real-time as you save.

## **Phase 4: The Logic Foundation (Test-Driven Logic)**

**Goal:** Verify the "Brain" works before building the "Face."

- **Who:** AI (Execution) \+ CEO (Quality Assurance).
- **Bridging the Gap (Linking 2-3-4):**
  - **Data Model (from PRD) \-\> Data Layer:** The AI uses your Data Model to populate either a data.js file (static) or your database schemas/initial migration scripts (backend).
  - **Functional Requirements (from PRD) \-\> Logic Layer:** Your requirements dictate exactly which functions the AI needs to write. For simple apps, this is app.js. For complex apps, this includes API controllers, service layers, or backend handlers.
  - **User Stories (from PRD) \-\> tests.js:** Every User Story is a test case. Tests should verify that the logic—whether it's an algorithm in a browser or an API endpoint on a server—returns the correct results for specific inputs.
- **Action:**
  - Ask the AI to write the core logic based strictly on the **Functional Requirements** and **Data Model** in your PRD.
  - **Crucial:** Require a tests.js (or backend test suite) immediately. Tests must verify the underlying logic before you spend time on the UI/CSS.
- **Output:** A passing test suite in the console or terminal.

## **Phase 5: Iteration & The CEO Review (PR Workflow)**

**Goal:** Feature updates without "Production" downtime.

- **Who:** CEO (Editor-in-Chief).
- **Action:**
  - **Never commit to main directly.** Use feature branches (e.g., refactor/housekeeping).
  - **The "Diff" Review:** Before merging, read the code changes. Look for:
    - **Context Drift:** Did the AI reference a variable that doesn't exist?
    - **Magic Numbers:** Are there hardcoded pixels instead of config constants?
    - **Leftovers:** Did it delete code we needed?
  - **Squash and Merge:** Keep the history clean.
- **Output:** A transparent update to the live site.

## **Phase 6: The Paper Trail (Maintenance)**

**Goal:** Ensure "Future You" can maintain this in 5 years.

- **Who:** CEO (Documentation).
- **Action:** \* Log every release in CHANGELOG.md.
  - Offload "Scope Creep" ideas into ROADMAP.md rather than building them now.
- **Output:** A professional-grade documentation suite (README, PRD, CHANGELOG, ROADMAP).

### **CEO’s Checklist for AI Prompting:**

1. **Read the Diff:** Did it change something I didn't ask for?
2. **Verify Configuration:** Is logic separated from data?
3. **Concept Before Code:** Ask the AI to explain the logic _before_ it writes the code to ensure you understand the "How."

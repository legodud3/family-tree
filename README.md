## family-tree
Answer: Who is this person in relation to me?

## 6Ps
- Customer: Deo-Israni family member [user]
- Problem:
  - [user] doesn't know who person [xyz] is when
    - [user] is about to meet or has run into [xyz] AND/OR
    - [user] is in a conversation where [xyz] is mentioned AND/OR
  - [user] feels some combination of embarassement, cognitive load
- Value prop:
  - Your private social map of the family
- Product:
  - TBD
- Positioning:
  - Unlike a parent or relative, family-tree does not judge why you want to trace the path
  - Unlike a parent or relative, family-tree is available 24x7
  - Unlike a parent or relative, family-tree is fast and doesn't waste time in idle talk
- Promotion: 
  - Share via whatsapp in family group


## PRD
# Family Tree – v0 Product Definition

## 1. Goal

Build the lightest possible tool to answer exactly one question:

> **“Who the f is this person (to me)?”**

No DAUs/MAUs ambitions. Single-admin, homegrown family tool.

---

## 2. Architecture – ultra-light

* Static single-page HTML (or GitHub Pages-hosted).
* Data is embedded in the HTML/JS as a hardcoded JSON object.
* All logic (search + pathfinding) runs in the browser.
* No backend, no auth, no user accounts.

This is sufficient for a small/medium family tree. If it ever explodes in size, a backend can be added later.

---

## 3. Core feature (and only feature): “How is X related to me?”

Scope v0 to a **single user journey**:

> A single question on screen:
> **“How is [X] related to me?”**

Where:

* **[X]** = target person (the one you are asking about)
* **"me"** = the admin user (fixed in v0).

### UX flow / UI layout

Single, mostly blank page with one large line at the top:

> **How is [ dropdown/search: target person ] related to me?**

Details:

1. **Target selector (X)**

   * A searchable dropdown for all people in the tree.
   * Label: “How is [X] related to me?”

2. **Answer area (below the question)**

   * Hidden by default; appears once X is selected and a path exists.
   * Shows exactly one thing in v0:

     * **Relationship path from me to X**
       Example:
       `You → Dad → Ramesh`

No additional panels, no maps, no profile pages. Just this one question text, one selector, and a compact answer block.

---

## 4. User roles (v0)

* **Admin:** You (single person) with full control over the data.

  * Edits JSON inside the HTML file.
  * Does all create/read/update/delete (CRUD) on people and relationships.
* **Users:** Everyone else in the family (collapsed primary/secondary for now).

  * Read-only usage: they just search and view.

---

## 5. Data model (minimal)

### Person

For v0, each person has:

* `id` (internal unique identifier)
* `name` (display name only)

No nicknames, no "how to address" field, no extra attributes. These can be added later without breaking the core logic.

### Relationships

Store an explicit **relationship table** covering parent/child, spouse, and sibling links.

* Each relationship record: `{ from_id, to_id, type }`

  * `type` ∈ `{"parent", "spouse", "sibling"}`
* The relationship table is a flat list/array of such records.
* For pathfinding, you treat all of these as edges in the graph.

Notes:

* `"parent"` is directional (from parent → child).
* `"spouse"` and `"sibling"` are logically symmetric; in the graph, you can traverse both ways.

This gives you a simple graph structure (built from all relationship types) where the main operation is: **find the shortest path between ****`me_id`**** and ****`target_id`****.**

Store an explicit **relationship table** covering parent/child, spouse, and sibling links.

* Each relationship record: `{ from_id, to_id, type }`

  * `type` ∈ `{"parent", "spouse", "sibling"}`
* The relationship table is a flat list/array of such records.
* For pathfinding, you treat all of these as edges in the graph.

Notes:

* `"parent"` is directional (from parent → child).
* `"spouse"` and `"sibling"` are logically symmetric; in the graph, you can traverse both ways.

This gives you a simple graph structure (built from all relationship types) where the main operation is: **find the shortest path between ****`me_id`**** and ****`target_id`****.**

---

## 6. Logic / algorithms (keep it dumb and robust)

### 6.1 Build the graph from the relationship table

* Start from the `relationships` array:

  * Each record: `{ from_id, to_id, type }` where `type` ∈ `{"parent", "spouse", "sibling"}`.
* Build an **adjacency list** in memory:

  * For each relationship record, add **two** edges in the adjacency list:

    * `from_id → to_id`
    * `to_id → from_id`
  * For pathfinding, you **ignore `type`** – all relationship types are simply edges in the graph.

This means the effective graph used for search is **undirected**, even though `"parent"` is conceptually directional in the data model.

### 6.2 Running the query (on selection)

1. Fix `me_id` in the code as the canonical "Me" (you, the admin) for v0.
2. Take `target_id` from the **target selector (X)** dropdown.
3. Run a basic **Breadth-First Search (BFS)** from `me_id` to `target_id` using the adjacency list.
4. If a path is found, you get a sequence of ids: `[me_id, ..., target_id]`.
5. Convert ids to display names using the `people` array, and render the path, e.g.:
   `You → Dad → Ramesh`.

### 6.3 Display logic

* **Relationship path**

  * Render the path as names joined by arrows.
  * Example: `You → Dad → Ramesh`.

No "how to address" logic in v0. The only output is the path from you to the selected person.

* **How to address**

  * Render directly from `how_i_address` for the `target_id` person.
* **Relationship path**

  * Render the path as names joined by arrows.
  * Optionally append a short kin phrase derived from `how_i_address` at the end, e.g.:
    `You → Dad → Ramesh (Dad’s elder brother)`

### 6.4 What we explicitly do *not* do

* Do **not** try to auto-generate kinship terms (uncle/aunt/cousin/second cousin, etc.).
* Do **not** derive different views depending on who is "Me" – in v0, `how_i_address` is always from **your** (the admin’s) perspective.

Net effect: the “smarts” of the system are just:

1. Turn the relationship table into an undirected graph.
2. Find the shortest path between you and them using BFS.
3. Display that path and your pre-written `how_i_address` sentence for the target person.

---

## 7. What is intentionally excluded from v0

To stay absolutely focused on “who the f is this person,” v0 will **not** include:

* Browsing / map / zooming view of the whole family.
* Multiple admins or role-based access.
* Photos, videos, or media attachments.
* Social links (LinkedIn, Instagram, etc.).
* Extra attributes (city, occupation, birthdays, notes).
* Comments, tags, likes, or social features.
* Import/export tools, CSV uploads, bulk editing UI.
* Automated kinship naming logic.

All of that can be layered on later **without** changing the core idea.

---

## 8. Admin workflow (how you actually maintain it)

v0 editing model:

* Data lives as a JS/JSON constant inside the HTML file.
* To update:

  1. Open the file in a code editor.
  2. Add/edit people and relationships in the JSON.
  3. Commit/push or re-upload to hosting.

No UI for CRUD in v0. Admin editing is “edit file + redeploy.”

---

## 9. Refined value prop & copy

Given this narrow focus, the value prop can be:

* **“Your private map of who everyone is to you.”**

This directly addresses the core anxiety:

* Before a meeting: “Who is this person again?”
* During a conversation: “Who the f are they talking about?”

The app exists purely to give you instant, judgment-free clarity on that question.

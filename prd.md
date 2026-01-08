# Product Requirements Document (v0)

## 1. Goal

Build the lightest possible tool to answer exactly one question:

> **"How is this person related (to me)?"**

## 2. Architecture

- **Stack:** Plain HTML/CSS/JS. No framework, no build step.
- **Data:** Hardcoded JSON object in `data.js`.
- **Hosting:** Static (GitHub Pages).

## 3. Data Model

- **Nodes:** People (`id`, `name`).
- **Edges:** Relationships (`from_id`, `to_id`, `type`).
  - Types: `parent`, `spouse`, `sibling`.
  - Graph is treated as undirected for traversal.

## 4. Algorithms

- **Pathfinding:** Standard BFS (Breadth-First Search) to find the shortest path of IDs.
- **Visualization:**
  - Calculates "Generation Delta" (Parent = +1, Child = -1, Spouse = 0).
  - Renders a Grid (Generations on Y-axis, Steps on X-axis).

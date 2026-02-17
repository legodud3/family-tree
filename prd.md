# Product Requirements Document (v0.3)

## Product Vision

Create a beautiful private family graph that helps a parent preserve and explain kinship to a child over time.

## Primary User Stories

1. As a parent, I can pick any person and instantly understand their relationship to me.
2. As a family curator, I can store richer context (nicknames, notes, confidence, subtype).
3. As a mobile user, I can read results quickly with visual clarity.

## Core Capabilities

- Graph traversal via BFS shortest path
- Kinship resolver that maps path patterns to human-friendly labels
- Visual path rendering across generations
- Light/dark theme toggle

## Data Model

### Person

- `id` (required)
- `name` (required)
- `display_name`, `nickname`, `pronouns`, `birth_year`, `notes`, `tags` (optional)

### Relationship

- `from_id`, `to_id`, `type` (required)
- `subtype`, `since`, `confidence`, `notes` (optional)

## Non-Goals (for now)

- No login/auth
- No backend database
- No collaborative editing

## Success Criteria

- New family member can be added in <2 minutes
- Kinship answer appears instantly (<100ms local)
- App is understandable to non-technical family members

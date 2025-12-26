function buildAdjacencyList(relationships) {
  const adj = new Map();

  function addEdge(a, b) {
    if (!adj.has(a)) adj.set(a, []);
    adj.get(a).push(b);
  }

  for (const rel of relationships) {
    const { from_id, to_id } = rel;
    // Undirected graph for pathfinding: add both directions
    addEdge(from_id, to_id);
    addEdge(to_id, from_id);
  }

  return adj;
}

function bfsPath(startId, targetId, adj) {
  if (startId === targetId) {
    return [startId];
  }

  const queue = [startId];
  const visited = new Set([startId]);
  const parent = new Map(); // childId -> parentId

  while (queue.length > 0) {
    const current = queue.shift();
    const neighbours = adj.get(current) || [];

    for (const next of neighbours) {
      if (!visited.has(next)) {
        visited.add(next);
        parent.set(next, current);
        if (next === targetId) {
          // Reconstruct path
          const path = [targetId];
          let cur = targetId;
          while (parent.has(cur)) {
            cur = parent.get(cur);
            path.push(cur);
          }
          return path.reverse();
        }
        queue.push(next);
      }
    }
  }

  // No path found
  return null;
}

function getPersonById(id) {
  return data.people.find(p => p.id === id) || null;
}

function getRelationshipLabel(aId, bId) {
  const rel = data.relationships.find(
    r =>
      (r.from_id === aId && r.to_id === bId) ||
      (r.from_id === bId && r.to_id === aId)
  );
  if (!rel) return "";
  if (rel.type === "spouse") return "spouse of";
  if (rel.type === "sibling") return "sibling of";
  if (rel.type === "parent") {
    // Directional: from_id is parent of to_id
    return rel.from_id === aId ? "parent of" : "child of";
  }
  return "";
}

function getGenerationDelta(aId, bId) {
  const rel = data.relationships.find(
    r =>
      (r.from_id === aId && r.to_id === bId) ||
      (r.from_id === bId && r.to_id === aId)
  );
  if (!rel) return 0;
  if (rel.type === "spouse" || rel.type === "sibling") return 0;
  if (rel.type === "parent") {
    // Directional: from_id is parent of to_id
    if (rel.from_id === aId && rel.to_id === bId) {
      // moving parent -> child: go down a generation
      return -1;
    }
    if (rel.from_id === bId && rel.to_id === aId) {
      // moving child -> parent: go up a generation
      return 1;
    }
  }
  return 0;
}

function renderGrid(pathIds) {
  const grid = document.getElementById("grid");
  if (!grid) return;

  // Clear previous diagram
  grid.innerHTML = "";

  if (!pathIds || pathIds.length === 0) {
    return;
  }

  // Compute levels (generation) and column positions along the path.
  // level: 0 for "You", +1 for parents, -1 for children, etc.
  // col: stays the same for vertical moves (parent/child), moves right for same-generation moves.
  const indexed = [];
  let currentLevel = 0;
  let currentCol = 1;
  indexed.push({ id: pathIds[0], level: currentLevel, col: currentCol });

  for (let i = 0; i < pathIds.length - 1; i++) {
    const aId = pathIds[i];
    const bId = pathIds[i + 1];
    const delta = getGenerationDelta(aId, bId);
    currentLevel += delta;

    if (delta === 0) {
      // spouse / sibling: same generation, move to the right
      currentCol += 1;
    } else {
      // parent / child: stay in the same column, move up/down a generation
      // (already handled by currentLevel)
    }

    indexed.push({ id: bId, level: currentLevel, col: currentCol });
  }

  // Determine min/max levels for row mapping
  let minLevel = 0;
  let maxLevel = 0;
  for (const entry of indexed) {
    if (entry.level < minLevel) minLevel = entry.level;
    if (entry.level > maxLevel) maxLevel = entry.level;
  }

  const rowsCount = maxLevel - minLevel + 1;
  const colsCount = Math.max(...indexed.map(e => e.col));

  // Map logical level to row index (0-based), with highest level at the top
  const levelToRow = new Map();
  for (let level = minLevel; level <= maxLevel; level++) {
    const rowIndex = maxLevel - level; // 0-based
    levelToRow.set(level, rowIndex);
  }

  // Layout: spread columns evenly across the available width,
  // and stack rows with generous vertical rhythm.
  const CELL_Y = 110;
  const PADDING_Y = 40;

  const containerWidth = grid.clientWidth || 600;
  const cols = Math.max(colsCount, 1);
  const horizontalStep = containerWidth / (cols + 1);

  const height = rowsCount * CELL_Y + PADDING_Y * 2;
  grid.style.height = `${height}px`;

  // Compute positions
  const posById = new Map();
  for (const entry of indexed) {
    const rowIndex = levelToRow.get(entry.level);
    const colIndex = entry.col; // 1-based
    const x = horizontalStep * colIndex;
    const y = PADDING_Y + rowIndex * CELL_Y;
    posById.set(entry.id, { x, y });
  }

  // Create SVG overlay
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", containerWidth);
  svg.setAttribute("height", height);
  svg.classList.add("grid-svg");
  grid.appendChild(svg);

  // Draw edges with labels
  for (let i = 0; i < pathIds.length - 1; i++) {
    const aId = pathIds[i];
    const bId = pathIds[i + 1];
    const posA = posById.get(aId);
    const posB = posById.get(bId);
    if (!posA || !posB) continue;

    const label = getRelationshipLabel(aId, bId) || "";

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", posA.x);
    line.setAttribute("y1", posA.y);
    line.setAttribute("x2", posB.x);
    line.setAttribute("y2", posB.y);
    line.setAttribute("stroke", "#d1d5db");
    line.setAttribute("stroke-width", "1.4");
    line.setAttribute("stroke-linecap", "round");
    svg.appendChild(line);

    if (label) {
      const text = document.createElementNS(svgNS, "text");
      let mx = (posA.x + posB.x) / 2;
      let my = (posA.y + posB.y) / 2;

      // Offset label depending on orientation
      if (Math.abs(posA.y - posB.y) < 4) {
        // Horizontal-ish
        my -= 12;
      } else {
        // Vertical-ish
        mx += 44;
      }

      text.setAttribute("x", mx);
      text.setAttribute("y", my);
      text.setAttribute("fill", "#6b7280");
      text.setAttribute("font-size", "11");
      text.setAttribute("letter-spacing", "0.02em");
      text.setAttribute("text-anchor", "middle");
      text.textContent = label;
      svg.appendChild(text);
    }
  }

  // Draw nodes on top
  for (const entry of indexed) {
    const pos = posById.get(entry.id);
    if (!pos) continue;

    const person = getPersonById(entry.id);
    const nodeEl = document.createElement("div");
    nodeEl.className = "grid-node";
    nodeEl.textContent =
      entry.id === ME_ID
        ? "You"
        : (person ? person.name : `Unknown(${entry.id})`);
    nodeEl.style.left = `${pos.x}px`;
    nodeEl.style.top = `${pos.y}px`;
    nodeEl.style.transform = "translate(-50%, -50%)";
    grid.appendChild(nodeEl);
  }
}

function renderPath(pathIds) {
  const answerEl = document.getElementById("answer");
  const labelEl = answerEl.querySelector(".answer-label");
  const pathEl = answerEl.querySelector(".answer-path");

  if (!pathIds || pathIds.length === 0) {
    labelEl.textContent = "Relationship path";
    pathEl.textContent = "No path found.";
    pathEl.classList.remove("muted");
    renderGrid(null);
    return;
  }

  labelEl.textContent = "Relationship path";

  if (pathIds.length === 1) {
    pathEl.textContent = "You";
    pathEl.classList.remove("muted");
    renderGrid(pathIds);
    return;
  }

  let result = "";
  for (let i = 0; i < pathIds.length - 1; i++) {
    const aId = pathIds[i];
    const bId = pathIds[i + 1];
    const aName =
      i === 0 ? "You" : (getPersonById(aId)?.name || `Unknown(${aId})`);
    const bName = getPersonById(bId)?.name || `Unknown(${bId})`;
    const label = getRelationshipLabel(aId, bId) || "?";

    if (i === 0) {
      result += aName + " ";
    }
    result += `-(${label})-> ${bName}`;
    if (i < pathIds.length - 2) {
      result += " ";
    }
  }

  pathEl.textContent = result;
  pathEl.classList.remove("muted");
  renderGrid(pathIds);
}

function onTargetChange(event) {
  const value = event.target.value;
  const answerEl = document.getElementById("answer");
  const pathEl = answerEl.querySelector(".answer-path");

  if (!value) {
    pathEl.textContent = "Pick someone to see how they connect to you.";
    pathEl.classList.add("muted");
    renderGrid(null);
    return;
  }

  const targetId = Number(value);
  const adj = buildAdjacencyList(data.relationships);
  const path = bfsPath(ME_ID, targetId, adj);

  if (!path) {
    renderPath(null);
  } else {
    renderPath(path);
  }
}

function getPreferredTheme() {
  try {
    const stored = window.localStorage.getItem("ft-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch (e) {
    // ignore
  }

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function applyTheme(theme) {
  const body = document.body;
  body.classList.toggle("dark", theme === "dark");
  try {
    window.localStorage.setItem("ft-theme", theme);
  } catch (e) {
    // ignore
  }
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.setAttribute("data-theme", theme);
  }
}

function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  const initial = getPreferredTheme();
  applyTheme(initial);

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const current = document.body.classList.contains("dark") ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

function init() {
  const select = document.getElementById("target-select");

  // Populate the dropdown with all people except ME_ID
  const others = data.people.filter(p => p.id !== ME_ID);
  for (const person of others) {
    const opt = document.createElement("option");
    opt.value = String(person.id);
    opt.textContent = person.name;
    select.appendChild(opt);
  }

  select.addEventListener("change", onTargetChange);
}

document.addEventListener("DOMContentLoaded", () => {
  init();
  setupThemeToggle();
});
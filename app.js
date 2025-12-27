// Fixed "me" id for v0 (Chinmay) – only once!
const ME_ID = 1;

// Make these visible to tests.js
window.buildAdjacencyList = function(relationships) {
  const adj = new Map();
  function addEdge(a, b) {
    if (!adj.has(a)) adj.set(a, []);
    adj.get(a).push(b);
  }
  for (const rel of relationships) {
    const { from_id, to_id } = rel;
    addEdge(from_id, to_id);
    addEdge(to_id, from_id);
  }
  return adj;
};

window.bfsPath = function(startId, targetId, adj) {
  if (startId === targetId) return [startId];
  const queue = [startId];
  const visited = new Set([startId]);
  const parent = new Map();
  while (queue.length > 0) {
    const current = queue.shift();
    const neighbours = adj.get(current) || [];
    for (const next of neighbours) {
      if (!visited.has(next)) {
        visited.add(next);
        parent.set(next, current);
        if (next === targetId) {
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
  return null;
};

window.getRelationshipLabel = function(aId, bId) {
  const rel = data.relationships.find(
    r => (r.from_id === aId && r.to_id === bId) || (r.from_id === bId && r.to_id === aId)
  );
  if (!rel) return "";
  if (rel.type === "spouse") return "spouse of";
  if (rel.type === "sibling") return "sibling of";
  if (rel.type === "parent") return rel.from_id === aId ? "parent of" : "child of";
  return "";
};

window.getGenerationDelta = function(aId, bId) {
  const rel = data.relationships.find(
    r => (r.from_id === aId && r.to_id === bId) || (r.from_id === bId && r.to_id === aId)
  );
  if (!rel) return 0;
  if (rel.type === "spouse" || rel.type === "sibling") return 0;
  if (rel.type === "parent") {
    if (rel.from_id === aId && rel.to_id === bId) return -1;
    if (rel.from_id === bId && rel.to_id === aId) return 1;
  }
  return 0;
};

// Normal functions (no window needed)
function getPersonById(id) {
  return data.people.find(p => p.id === id) || null;
}

function renderGrid(pathIds) {
  const grid = document.getElementById("grid");
  if (!grid) return;
  grid.innerHTML = "";
  if (!pathIds || pathIds.length === 0) return;

  const indexed = [];
  let currentLevel = 0;
  let currentCol = 1;
  indexed.push({ id: pathIds[0], level: currentLevel, col: currentCol });

  for (let i = 0; i < pathIds.length - 1; i++) {
    const aId = pathIds[i];
    const bId = pathIds[i + 1];
    const delta = getGenerationDelta(aId, bId);
    currentLevel += delta;
    if (delta === 0) currentCol += 1;
    indexed.push({ id: bId, level: currentLevel, col: currentCol });
  }

  let minLevel = 0, maxLevel = 0;
  for (const entry of indexed) {
    if (entry.level < minLevel) minLevel = entry.level;
    if (entry.level > maxLevel) maxLevel = entry.level;
  }

  const levelToRow = new Map();
  for (let level = minLevel; level <= maxLevel; level++) {
    levelToRow.set(level, maxLevel - level);
  }

  const CELL_Y = 160;
  const PADDING_Y = 80;
  const containerWidth = grid.clientWidth || 900;
  const cols = Math.max(...indexed.map(e => e.col), 1);
  const BRICK_WIDTH = 200;
  const MIN_GAP = 80;

  let spacing = 0;
  if (cols > 1) {
    spacing = Math.max((containerWidth - BRICK_WIDTH) / (cols - 1), BRICK_WIDTH + MIN_GAP);
  }

  const totalSpan = spacing * (cols - 1);
  const startX = cols === 1 ? containerWidth / 2 : (containerWidth - totalSpan) / 2;
  const height = (maxLevel - minLevel + 1) * CELL_Y + PADDING_Y * 2;
  grid.style.height = `${height}px`;

  const posById = new Map();
  indexed.forEach(entry => {
    const rowIndex = levelToRow.get(entry.level);
    const colIndex0 = entry.col - 1;
    const x = cols === 1 ? containerWidth / 2 : startX + colIndex0 * spacing;
    const y = PADDING_Y + rowIndex * CELL_Y;
    posById.set(entry.id, { x, y });
  });

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", containerWidth);
  svg.setAttribute("height", height);
  svg.classList.add("grid-svg");
  grid.appendChild(svg);

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
    svg.appendChild(line);

    if (label) {
      const text = document.createElementNS(svgNS, "text");
      let mx = (posA.x + posB.x) / 2;
      let my = (posA.y + posB.y) / 2;
      if (Math.abs(posA.y - posB.y) < 4) my -= 14;
      else mx += 48;
      text.setAttribute("x", mx);
      text.setAttribute("y", my);
      text.setAttribute("text-anchor", "middle");
      text.textContent = label;
      svg.appendChild(text);
    }
  }

  indexed.forEach((entry, i) => {
    const pos = posById.get(entry.id);
    if (!pos) return;
    const person = getPersonById(entry.id);
    const nodeEl = document.createElement("div");
    nodeEl.className = "grid-node";
    nodeEl.textContent = entry.id === ME_ID ? "You" : (person?.name || `Unknown(${entry.id})`);
    if (entry.id === ME_ID) nodeEl.setAttribute("data-is-me", "true");

    nodeEl.style.left = `${pos.x}px`;
    nodeEl.style.top = `${pos.y}px`;
    nodeEl.style.opacity = "0";
    nodeEl.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    grid.appendChild(nodeEl);

    setTimeout(() => nodeEl.style.opacity = "1", 60 * i);
  });
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
    const aName = i === 0 ? "You" : (getPersonById(aId)?.name || `Unknown(${aId})`);
    const bName = getPersonById(bId)?.name || `Unknown(${bId})`;
    const label = getRelationshipLabel(aId, bId) || "?";
    if (i === 0) result += aName + " ";
    result += `-(${label})-> ${bName}`;
    if (i < pathIds.length - 2) result += " ";
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
    pathEl.textContent = "Choose a family member to see your connection 🧡";
    pathEl.classList.add("muted");
    renderGrid(null);
    return;
  }

  const targetId = Number(value);
  const adj = buildAdjacencyList(data.relationships);
  const path = bfsPath(ME_ID, targetId, adj);

  if (!path) renderPath(null);
  else renderPath(path);
}

function getPreferredTheme() {
  try {
    const stored = window.localStorage.getItem("ft-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch (e) {}
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  try { window.localStorage.setItem("ft-theme", theme); } catch (e) {}
  document.getElementById("theme-toggle")?.setAttribute("data-theme", theme);
}

function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  const initial = getPreferredTheme();
  applyTheme(initial);
  toggle.addEventListener("click", () => {
    const current = document.body.classList.contains("dark") ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

function init() {
  const select = document.getElementById("target-select");
  if (!select || !data?.people) {
    console.warn("Dropdown or data not found – check data.js");
    return;
  }

  const others = data.people.filter(p => p.id !== ME_ID);
  others.forEach(person => {
    const opt = document.createElement("option");
    opt.value = String(person.id);
    opt.textContent = person.name;
    select.appendChild(opt);
  });

  select.addEventListener("change", onTargetChange);
}

document.addEventListener("DOMContentLoaded", () => {
  init();
  setupThemeToggle();
});
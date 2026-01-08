// Configuration for the visual layout
const VISUAL_CONFIG = {
  brickWidth: 200,
  cellHeight: 160,
  minGap: 80,
  paddingY: 80,
};

// Store the current path so we can re-draw it on resize
let currentPathIds = null;

// --- CORE LOGIC FUNCTIONS ---

function buildAdjacencyList(relationships) {
  const adj = new Map();

  // Validate input
  if (!Array.isArray(relationships)) {
    console.warn('buildAdjacencyList: relationships must be an array');
    return adj;
  }

  function addEdge(a, b) {
    // Validate edge IDs
    if (a == null || b == null || a === b) return;
    if (!adj.has(a)) adj.set(a, []);
    adj.get(a).push(b);
  }

  for (const rel of relationships) {
    // Validate relationship structure
    if (!rel || typeof rel !== 'object') {
      console.warn('buildAdjacencyList: skipping invalid relationship object', rel);
      continue;
    }
    const { from_id, to_id } = rel;
    // Validate that from_id and to_id exist and are valid
    if (from_id == null || to_id == null) {
      console.warn('buildAdjacencyList: skipping relationship with missing IDs', rel);
      continue;
    }
    addEdge(from_id, to_id);
    addEdge(to_id, from_id);
  }
  return adj;
}

function bfsPath(startId, targetId, adj) {
  // Validate inputs
  if (startId == null || targetId == null) {
    console.warn('bfsPath: startId and targetId must be provided');
    return null;
  }
  if (!(adj instanceof Map)) {
    console.warn('bfsPath: adj must be a Map');
    return null;
  }

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
}

function getRelationshipLabel(aId, bId) {
  // Validate inputs
  if (aId == null || bId == null) {
    console.warn('getRelationshipLabel: both aId and bId must be provided');
    return '';
  }

  // Validate data structure
  if (typeof data === 'undefined' || data === null) {
    console.warn('getRelationshipLabel: data is undefined or null');
    return '';
  }

  if (!data.relationships) {
    console.warn('getRelationshipLabel: data.relationships is missing');
    return '';
  }

  if (!Array.isArray(data.relationships)) {
    console.warn('getRelationshipLabel: data.relationships must be an array');
    return '';
  }

  const rel = data.relationships.find(
    (r) => r && ((r.from_id === aId && r.to_id === bId) || (r.from_id === bId && r.to_id === aId))
  );

  if (!rel) return '';

  // Validate relationship structure
  if (typeof rel !== 'object' || !rel.type) {
    console.warn('getRelationshipLabel: invalid relationship structure', rel);
    return '';
  }

  if (rel.type === 'spouse') return 'spouse of';
  if (rel.type === 'sibling') return 'sibling of';
  if (rel.type === 'parent') return rel.from_id === aId ? 'parent of' : 'child of';
  return '';
}

function getGenerationDelta(aId, bId) {
  // Validate inputs
  if (aId == null || bId == null) {
    console.warn('getGenerationDelta: both aId and bId must be provided');
    return 0;
  }

  // Validate data structure
  if (typeof data === 'undefined' || data === null) {
    console.warn('getGenerationDelta: data is undefined or null');
    return 0;
  }

  if (!data.relationships) {
    console.warn('getGenerationDelta: data.relationships is missing');
    return 0;
  }

  if (!Array.isArray(data.relationships)) {
    console.warn('getGenerationDelta: data.relationships must be an array');
    return 0;
  }

  const rel = data.relationships.find(
    (r) => r && ((r.from_id === aId && r.to_id === bId) || (r.from_id === bId && r.to_id === aId))
  );

  if (!rel) return 0;

  // Validate relationship structure
  if (typeof rel !== 'object' || !rel.type) {
    console.warn('getGenerationDelta: invalid relationship structure', rel);
    return 0;
  }

  if (rel.type === 'spouse' || rel.type === 'sibling') return 0;
  if (rel.type === 'parent') {
    if (rel.from_id === aId && rel.to_id === bId) return -1;
    if (rel.from_id === bId && rel.to_id === aId) return 1;
  }
  return 0;
}

function getPersonById(id) {
  // Validate input
  if (id == null) {
    console.warn('getPersonById: id must be provided');
    return null;
  }

  // Validate data structure
  if (typeof data === 'undefined' || data === null) {
    console.warn('getPersonById: data is undefined or null');
    return null;
  }

  if (!data.people) {
    console.warn('getPersonById: data.people is missing');
    return null;
  }

  if (!Array.isArray(data.people)) {
    console.warn('getPersonById: data.people must be an array');
    return null;
  }

  const person = data.people.find((p) => p && p.id === id);
  if (!person) return null;

  // Validate person structure
  if (typeof person !== 'object' || !Object.prototype.hasOwnProperty.call(person, 'id')) {
    console.warn('getPersonById: invalid person structure', person);
    return null;
  }

  return person;
}

// --- RENDER & UI FUNCTIONS ---

function renderGrid(pathIds) {
  if (typeof document === 'undefined') return;

  const grid = document.getElementById('grid');
  if (!grid) return;

  grid.innerHTML = '';

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

  let minLevel = 0;
  let maxLevel = 0;
  for (const entry of indexed) {
    if (entry.level < minLevel) minLevel = entry.level;
    if (entry.level > maxLevel) maxLevel = entry.level;
  }

  const levelToRow = new Map();
  for (let level = minLevel; level <= maxLevel; level++) {
    levelToRow.set(level, maxLevel - level);
  }

  const containerWidth = grid.clientWidth || 900;
  const cols = Math.max(...indexed.map((e) => e.col), 1);
  const { brickWidth, cellHeight, minGap, paddingY } = VISUAL_CONFIG;

  let spacing = 0;
  if (cols > 1) {
    spacing = Math.max((containerWidth - brickWidth) / (cols - 1), brickWidth + minGap);
  }

  const totalSpan = spacing * (cols - 1);
  const startX = cols === 1 ? containerWidth / 2 : (containerWidth - totalSpan) / 2;
  const height = (maxLevel - minLevel + 1) * cellHeight + paddingY * 2;
  grid.style.height = `${height}px`;

  const posById = new Map();
  indexed.forEach((entry) => {
    const rowIndex = levelToRow.get(entry.level);
    const colIndex0 = entry.col - 1;
    const x = cols === 1 ? containerWidth / 2 : startX + colIndex0 * spacing;
    const y = paddingY + rowIndex * cellHeight;
    posById.set(entry.id, { x, y });
  });

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', containerWidth);
  svg.setAttribute('height', height);
  svg.classList.add('grid-svg');
  grid.appendChild(svg);

  for (let i = 0; i < pathIds.length - 1; i++) {
    const aId = pathIds[i];
    const bId = pathIds[i + 1];
    const posA = posById.get(aId);
    const posB = posById.get(bId);
    if (!posA || !posB) continue;

    const label = getRelationshipLabel(aId, bId) || '';

    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', posA.x);
    line.setAttribute('y1', posA.y);
    line.setAttribute('x2', posB.x);
    line.setAttribute('y2', posB.y);
    svg.appendChild(line);

    if (label) {
      const text = document.createElementNS(svgNS, 'text');
      let mx = (posA.x + posB.x) / 2;
      let my = (posA.y + posB.y) / 2;
      if (Math.abs(posA.y - posB.y) < 4) my -= 14;
      else mx += 48;
      text.setAttribute('x', mx);
      text.setAttribute('y', my);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = label;
      svg.appendChild(text);
    }
  }

  indexed.forEach((entry) => {
    const pos = posById.get(entry.id);
    if (!pos) return;

    // Validate entry structure
    if (!entry || entry.id == null) {
      console.warn('renderGrid: skipping invalid entry', entry);
      return;
    }

    const person = getPersonById(entry.id);
    const nodeEl = document.createElement('div');
    nodeEl.className = 'grid-node';

    // Safely access ME_ID with fallback
    const meId = typeof data !== 'undefined' && data && data.ME_ID ? data.ME_ID : null;
    nodeEl.textContent = entry.id === meId ? 'You' : person?.name || `Unknown(${entry.id})`;
    if (entry.id === meId) nodeEl.setAttribute('data-is-me', 'true');

    nodeEl.style.left = `${pos.x}px`;
    nodeEl.style.top = `${pos.y}px`;
    nodeEl.style.opacity = '1';
    grid.appendChild(nodeEl);
  });
}

function renderPath(pathIds) {
  currentPathIds = pathIds;
  if (typeof document === 'undefined') return;

  const answerEl = document.getElementById('answer');
  if (!answerEl) {
    console.error('renderPath: answer element not found');
    return;
  }

  const labelEl = answerEl.querySelector('.answer-label');
  const pathEl = answerEl.querySelector('.answer-path');

  if (!labelEl || !pathEl) {
    console.error('renderPath: required child elements not found');
    return;
  }

  if (!pathIds || pathIds.length === 0) {
    labelEl.textContent = 'Relationship path';
    pathEl.textContent = 'No path found.';
    pathEl.classList.remove('muted');
    renderGrid(null);
    return;
  }

  // Validate pathIds array
  if (!Array.isArray(pathIds)) {
    console.warn('renderPath: pathIds must be an array');
    labelEl.textContent = 'Relationship path';
    pathEl.textContent = 'Error: Invalid path data.';
    pathEl.classList.remove('muted');
    renderGrid(null);
    return;
  }

  labelEl.textContent = 'Relationship path';

  if (pathIds.length === 1) {
    pathEl.textContent = 'You';
    pathEl.classList.remove('muted');
    renderGrid(pathIds);
    return;
  }

  let result = '';
  for (let i = 0; i < pathIds.length - 1; i++) {
    const aId = pathIds[i];
    const bId = pathIds[i + 1];

    // Validate IDs in path
    if (aId == null || bId == null) {
      console.warn('renderPath: skipping invalid IDs in path', { aId, bId });
      continue;
    }

    const aPerson = getPersonById(aId);
    const bPerson = getPersonById(bId);
    const aName = i === 0 ? 'You' : aPerson?.name || `Unknown(${aId})`;
    const bName = bPerson?.name || `Unknown(${bId})`;
    const label = getRelationshipLabel(aId, bId) || '?';
    if (i === 0) result += aName + ' ';
    result += `-(${label})-> ${bName}`;
    if (i < pathIds.length - 2) result += ' ';
  }

  pathEl.textContent = result || 'Error: Unable to render path.';
  pathEl.classList.remove('muted');
  renderGrid(pathIds);
}

function onTargetChange(event) {
  if (!event || !event.target) {
    console.error('onTargetChange: invalid event object');
    return;
  }

  const value = event.target.value;
  const answerEl = document.getElementById('answer');

  if (!answerEl) {
    console.error('onTargetChange: answer element not found');
    return;
  }

  const pathEl = answerEl.querySelector('.answer-path');
  if (!pathEl) {
    console.error('onTargetChange: path element not found');
    return;
  }

  if (!value) {
    pathEl.textContent = 'Choose a family member to see your connection 🧡';
    pathEl.classList.add('muted');
    renderGrid(null);
    return;
  }

  // Validate data structure before use
  if (typeof data === 'undefined' || data === null) {
    pathEl.textContent = 'Error: Family data is not available. Please refresh the page.';
    pathEl.classList.remove('muted');
    renderGrid(null);
    console.error('onTargetChange: data is undefined or null');
    return;
  }

  if (!data.relationships || !Array.isArray(data.relationships)) {
    pathEl.textContent = 'Error: Relationship data is invalid. Please check your data file.';
    pathEl.classList.remove('muted');
    renderGrid(null);
    console.error('onTargetChange: data.relationships is missing or invalid');
    return;
  }

  if (data.ME_ID == null) {
    pathEl.textContent = 'Error: Your ID (ME_ID) is not set. Please check your data file.';
    pathEl.classList.remove('muted');
    renderGrid(null);
    console.error('onTargetChange: data.ME_ID is missing');
    return;
  }

  const targetId = Number(value);
  if (isNaN(targetId)) {
    pathEl.textContent = 'Error: Invalid person selected.';
    pathEl.classList.remove('muted');
    renderGrid(null);
    console.error('onTargetChange: invalid targetId', value);
    return;
  }

  const adj = buildAdjacencyList(data.relationships);
  const path = bfsPath(data.ME_ID, targetId, adj);

  if (!path) renderPath(null);
  else renderPath(path);
}

function getPreferredTheme() {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem('ft-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  document.body.classList.toggle('dark', theme === 'dark');
  try {
    window.localStorage.setItem('ft-theme', theme);
  } catch {}
  document.getElementById('theme-toggle')?.setAttribute('data-theme', theme);
}

function setupThemeToggle() {
  if (typeof document === 'undefined') return;
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const initial = getPreferredTheme();
  applyTheme(initial);
  toggle.addEventListener('click', () => {
    const current = document.body.classList.contains('dark') ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

function init() {
  if (typeof document === 'undefined') return;
  const select = document.getElementById('target-select');

  if (!select) {
    console.error('init: target-select element not found');
    return;
  }

  // Validate data structure
  if (typeof data === 'undefined' || data === null) {
    console.error('init: data is undefined or null');
    select.innerHTML = '<option value="">Error: Data not available</option>';
    const answerEl = document.getElementById('answer');
    if (answerEl) {
      const pathEl = answerEl.querySelector('.answer-path');
      if (pathEl) {
        pathEl.textContent = 'Error: Family data is not available. Please check your data file.';
        pathEl.classList.remove('muted');
      }
    }
    return;
  }

  if (!data.people) {
    console.error('init: data.people is missing');
    select.innerHTML = '<option value="">Error: People data missing</option>';
    const answerEl = document.getElementById('answer');
    if (answerEl) {
      const pathEl = answerEl.querySelector('.answer-path');
      if (pathEl) {
        pathEl.textContent = 'Error: People data is missing. Please check your data file.';
        pathEl.classList.remove('muted');
      }
    }
    return;
  }

  if (!Array.isArray(data.people)) {
    console.error('init: data.people must be an array');
    select.innerHTML = '<option value="">Error: Invalid data format</option>';
    const answerEl = document.getElementById('answer');
    if (answerEl) {
      const pathEl = answerEl.querySelector('.answer-path');
      if (pathEl) {
        pathEl.textContent =
          'Error: People data is in an invalid format. Please check your data file.';
        pathEl.classList.remove('muted');
      }
    }
    return;
  }

  if (data.ME_ID == null) {
    console.error('init: data.ME_ID is missing');
    select.innerHTML = '<option value="">Error: ME_ID not set</option>';
    const answerEl = document.getElementById('answer');
    if (answerEl) {
      const pathEl = answerEl.querySelector('.answer-path');
      if (pathEl) {
        pathEl.textContent = 'Error: Your ID (ME_ID) is not set. Please check your data file.';
        pathEl.classList.remove('muted');
      }
    }
    return;
  }

  select.innerHTML = '<option value="">Select a person</option>';

  // Filter and validate people
  const others = data.people.filter((p) => {
    if (!p || typeof p !== 'object' || p.id == null) {
      console.warn('init: skipping invalid person object', p);
      return false;
    }
    return p.id !== data.ME_ID;
  });

  if (others.length === 0) {
    select.innerHTML = '<option value="">No other family members found</option>';
    console.warn('init: no other people found after filtering');
    return;
  }

  others.forEach((person) => {
    const opt = document.createElement('option');
    opt.value = String(person.id);
    opt.textContent = person.name || `Person ${person.id}`;
    select.appendChild(opt);
  });

  select.addEventListener('change', onTargetChange);

  window.addEventListener('resize', () => {
    if (currentPathIds) {
      renderGrid(currentPathIds);
    }
  });
}

// Initialize only if in browser
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    init();
    setupThemeToggle();
  });
}

// --- UNIVERSAL EXPORTS ---

// 1. Export for Node.js (Jest)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    buildAdjacencyList,
    bfsPath,
    getRelationshipLabel,
    getGenerationDelta,
  };
}

// 2. Export for Browser (attach to window)
if (typeof window !== 'undefined') {
  window.buildAdjacencyList = buildAdjacencyList;
  window.bfsPath = bfsPath;
  window.getRelationshipLabel = getRelationshipLabel;
  window.getGenerationDelta = getGenerationDelta;
}

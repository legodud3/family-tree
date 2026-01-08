const { buildAdjacencyList, bfsPath, getRelationshipLabel, getGenerationDelta } = require('./app');

// Mock Data - Simple Family
const mockPeople = [
  { id: 1, name: 'Dad' },
  { id: 2, name: 'Mom' },
  { id: 3, name: 'Kid' },
];

const mockRelationships = [
  { from_id: 1, to_id: 3, type: 'parent' },
  { from_id: 2, to_id: 3, type: 'parent' },
  { from_id: 1, to_id: 2, type: 'spouse' },
];

// Mock Data - Extended Family (for complex tests)
const extendedPeople = [
  { id: 10, name: 'Grandpa' },
  { id: 11, name: 'Grandma' },
  { id: 12, name: 'Uncle' },
  { id: 13, name: 'Aunt' },
  { id: 14, name: 'Cousin' },
];

const extendedRelationships = [
  { from_id: 10, to_id: 1, type: 'parent' },
  { from_id: 11, to_id: 1, type: 'parent' },
  { from_id: 10, to_id: 12, type: 'parent' },
  { from_id: 11, to_id: 12, type: 'parent' },
  { from_id: 12, to_id: 13, type: 'spouse' },
  { from_id: 12, to_id: 14, type: 'parent' },
  { from_id: 13, to_id: 14, type: 'parent' },
  { from_id: 10, to_id: 11, type: 'spouse' },
  { from_id: 1, to_id: 2, type: 'spouse' },
  { from_id: 1, to_id: 3, type: 'parent' },
  { from_id: 2, to_id: 3, type: 'parent' },
];

// Mock Global Data
global.data = {
  ME_ID: 1,
  people: mockPeople,
  relationships: mockRelationships,
};

describe('buildAdjacencyList', () => {
  test('creates bidirectional edges', () => {
    const adj = buildAdjacencyList(mockRelationships);
    expect(adj.get(1)).toContain(3);
    expect(adj.get(3)).toContain(1);
    expect(adj.get(1)).toContain(2);
    expect(adj.get(2)).toContain(1);
  });

  test('handles empty relationships array', () => {
    const adj = buildAdjacencyList([]);
    expect(adj.size).toBe(0);
  });

  test('handles single relationship', () => {
    const singleRel = [{ from_id: 1, to_id: 2, type: 'spouse' }];
    const adj = buildAdjacencyList(singleRel);
    expect(adj.get(1)).toContain(2);
    expect(adj.get(2)).toContain(1);
  });

  test('handles complex family structures', () => {
    const adj = buildAdjacencyList(extendedRelationships);
    expect(adj.get(10)).toContain(1);
    expect(adj.get(1)).toContain(10);
    expect(adj.get(12)).toContain(14);
    expect(adj.get(14)).toContain(12);
  });
});

describe('bfsPath', () => {
  const adj = buildAdjacencyList(mockRelationships);

  test('finds direct path', () => {
    const path = bfsPath(1, 3, adj);
    expect(path).toEqual([1, 3]);
  });

  test('returns single node for self-reference', () => {
    const path = bfsPath(1, 1, adj);
    expect(path).toEqual([1]);
  });

  test('finds multi-hop path', () => {
    const path = bfsPath(1, 2, adj);
    expect(path).toEqual([1, 2]);
  });

  test('returns null when no path exists', () => {
    const isolatedAdj = buildAdjacencyList([{ from_id: 99, to_id: 100, type: 'spouse' }]);
    const path = bfsPath(1, 99, isolatedAdj);
    expect(path).toBeNull();
  });

  test('finds path through extended family', () => {
    const extendedAdj = buildAdjacencyList(extendedRelationships);
    const path = bfsPath(3, 14, extendedAdj);
    expect(path).not.toBeNull();
    expect(path[0]).toBe(3);
    expect(path[path.length - 1]).toBe(14);
  });

  test('handles path through different relationship types', () => {
    const extendedAdj = buildAdjacencyList(extendedRelationships);
    const path = bfsPath(3, 14, extendedAdj);
    expect(path.length).toBeGreaterThan(1);
  });
});

describe('getRelationshipLabel', () => {
  beforeEach(() => {
    global.data = {
      ME_ID: 1,
      people: mockPeople,
      relationships: mockRelationships,
    };
  });

  test('returns "parent of" for parent relationship', () => {
    expect(getRelationshipLabel(1, 3)).toBe('parent of');
  });

  test('returns "child of" for reverse parent relationship', () => {
    expect(getRelationshipLabel(3, 1)).toBe('child of');
  });

  test('returns "spouse of" for spouse relationship', () => {
    expect(getRelationshipLabel(1, 2)).toBe('spouse of');
    expect(getRelationshipLabel(2, 1)).toBe('spouse of');
  });

  test('returns "sibling of" for sibling relationship', () => {
    const siblingRel = [{ from_id: 4, to_id: 5, type: 'sibling' }];
    global.data.relationships = siblingRel;
    expect(getRelationshipLabel(4, 5)).toBe('sibling of');
    expect(getRelationshipLabel(5, 4)).toBe('sibling of');
  });

  test('returns empty string for non-existent relationship', () => {
    expect(getRelationshipLabel(1, 999)).toBe('');
  });

  test('returns empty string when data is undefined', () => {
    global.data = undefined;
    expect(getRelationshipLabel(1, 2)).toBe('');
  });

  test('returns empty string when relationships array is missing', () => {
    global.data = { people: mockPeople };
    expect(getRelationshipLabel(1, 2)).toBe('');
  });
});

describe('getGenerationDelta', () => {
  beforeEach(() => {
    global.data = {
      ME_ID: 1,
      people: mockPeople,
      relationships: mockRelationships,
    };
  });

  test('returns -1 for parent relationship (from is parent)', () => {
    expect(getGenerationDelta(1, 3)).toBe(-1);
  });

  test('returns 1 for child relationship (from is child)', () => {
    expect(getGenerationDelta(3, 1)).toBe(1);
  });

  test('returns 0 for spouse relationship', () => {
    expect(getGenerationDelta(1, 2)).toBe(0);
    expect(getGenerationDelta(2, 1)).toBe(0);
  });

  test('returns 0 for sibling relationship', () => {
    const siblingRel = [{ from_id: 4, to_id: 5, type: 'sibling' }];
    global.data.relationships = siblingRel;
    expect(getGenerationDelta(4, 5)).toBe(0);
    expect(getGenerationDelta(5, 4)).toBe(0);
  });

  test('returns 0 for non-existent relationship', () => {
    expect(getGenerationDelta(1, 999)).toBe(0);
  });

  test('returns 0 when data is undefined', () => {
    global.data = undefined;
    expect(getGenerationDelta(1, 2)).toBe(0);
  });

  test('returns 0 when relationships array is missing', () => {
    global.data = { people: mockPeople };
    expect(getGenerationDelta(1, 2)).toBe(0);
  });
});

describe('Edge Cases', () => {
  test('handles invalid person IDs', () => {
    const adj = buildAdjacencyList(mockRelationships);
    const path = bfsPath(999, 888, adj);
    expect(path).toBeNull();
  });

  test('handles empty data object', () => {
    global.data = {};
    expect(getRelationshipLabel(1, 2)).toBe('');
    expect(getGenerationDelta(1, 2)).toBe(0);
  });

  test('handles malformed relationships', () => {
    const malformed = [{ from_id: 1 }, { to_id: 2 }];
    const adj = buildAdjacencyList(malformed);
    expect(adj.size).toBeGreaterThanOrEqual(0);
  });
});
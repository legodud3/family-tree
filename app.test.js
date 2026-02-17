const {
  buildAdjacencyList,
  bfsPath,
  getRelationshipLabel,
  getGenerationDelta,
  normalizeData,
  resolveKinship,
} = require('./app');

const mockPeople = [
  { id: 1, name: 'Dad' },
  { id: 2, name: 'Mom' },
  { id: 3, name: 'Kid' },
  { id: 4, name: 'Grandpa' },
  { id: 5, name: 'Aunt' },
];

const mockRelationships = [
  { from_id: 1, to_id: 3, type: 'parent' },
  { from_id: 2, to_id: 3, type: 'parent' },
  { from_id: 1, to_id: 2, type: 'spouse' },
  { from_id: 4, to_id: 1, type: 'parent' },
  { from_id: 1, to_id: 5, type: 'sibling' },
];

const dataset = normalizeData({
  ME_ID: 1,
  people: mockPeople,
  relationships: mockRelationships,
});

describe('buildAdjacencyList', () => {
  test('creates bidirectional edges', () => {
    const adj = buildAdjacencyList(mockRelationships);
    expect(adj.get(1)).toContain(3);
    expect(adj.get(3)).toContain(1);
    expect(adj.get(1)).toContain(2);
    expect(adj.get(2)).toContain(1);
  });
});

describe('bfsPath', () => {
  const adj = buildAdjacencyList(mockRelationships);

  test('finds direct path', () => {
    expect(bfsPath(1, 3, adj)).toEqual([1, 3]);
  });

  test('returns null when no path exists', () => {
    expect(bfsPath(1, 99, adj)).toBeNull();
  });
});

describe('relationship helpers', () => {
  test('returns labels and generation deltas', () => {
    expect(getRelationshipLabel(1, 3, dataset)).toBe('parent of');
    expect(getRelationshipLabel(3, 1, dataset)).toBe('child of');
    expect(getGenerationDelta(1, 3, dataset)).toBe(-1);
    expect(getGenerationDelta(3, 1, dataset)).toBe(1);
  });

  test('normalizes extended metadata safely', () => {
    const enriched = normalizeData({
      ME_ID: '1',
      people: [{ id: '9', display_name: 'Nani', tags: ['maternal'] }],
      relationships: [{ from_id: '9', to_id: '1', type: 'parent', subtype: 'biological' }],
    });

    expect(enriched.ME_ID).toBe(1);
    expect(enriched.people[0].id).toBe(9);
    expect(enriched.people[0].name).toBe('Nani');
    expect(enriched.relationships[0].subtype).toBe('biological');
  });
});

describe('resolveKinship', () => {
  test('resolves direct family labels', () => {
    expect(resolveKinship([1, 3], dataset)).toBe('parent');
    expect(resolveKinship([3, 1], dataset)).toBe('child');
    expect(resolveKinship([1, 2], dataset)).toBe('spouse');
  });

  test('resolves composite labels and fallback', () => {
    expect(resolveKinship([1, 4], dataset)).toBe('child');
    expect(resolveKinship([3, 1, 5], dataset)).toBe('aunt/uncle');
    expect(resolveKinship([3, 1, 2], dataset)).toBe('relative (2 hops away)');
  });
});

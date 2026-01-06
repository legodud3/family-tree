const { buildAdjacencyList, bfsPath, getRelationshipLabel } = require('./app');

// Mock Data
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

// Mock Global Data
global.data = {
  ME_ID: 1,
  people: mockPeople,
  relationships: mockRelationships,
};

describe('Core Logic Tests', () => {
  const adj = buildAdjacencyList(mockRelationships);

  test('buildAdjacencyList links family members', () => {
    expect(adj.get(1)).toContain(3);
    expect(adj.get(3)).toContain(1);
  });

  test('bfsPath finds a path', () => {
    const path = bfsPath(1, 3, adj);
    expect(path).toEqual([1, 3]);
  });

  test('getRelationshipLabel works', () => {
    expect(getRelationshipLabel(1, 3)).toBe('parent of');
  });
});

// app.test.js

// 1. Import the functions
const { 
  buildAdjacencyList, 
  bfsPath, 
  getRelationshipLabel, 
  getGenerationDelta 
} = require('./app');

// 2. Setup Mock Data
// Since app.js relies on a global 'data' object, we must mock it here.
const mockPeople = [
  { id: 1, name: "Dad" },
  { id: 2, name: "Mom" },
  { id: 3, name: "Kid" }
];

const mockRelationships = [
  { from_id: 1, to_id: 3, type: 'parent' }, // Dad -> Kid
  { from_id: 2, to_id: 3, type: 'parent' }, // Mom -> Kid
  { from_id: 1, to_id: 2, type: 'spouse' }, // Dad <-> Mom
];

// Set the global variable 'data' that app.js expects
global.data = {
  ME_ID: 1,
  people: mockPeople,
  relationships: mockRelationships
};

// 3. The Tests
describe('Core Logic Tests', () => {
  
  const adj = buildAdjacencyList(mockRelationships);

  test('buildAdjacencyList should create bidirectional links', () => {
    // 1 -> 3 implies 3 -> 1
    expect(adj.get(1)).toContain(3);
    expect(adj.get(3)).toContain(1);
  });

  test('bfsPath should find direct paths', () => {
    // Dad(1) to Kid(3)
    const path = bfsPath(1, 3, adj);
    expect(path).toEqual([1, 3]);
  });

  test('bfsPath should find indirect paths (via spouse)', () => {
    // Kid(3) to Mom(2). Path: 3 -> 1 -> 2 (via dad) OR 3 -> 2 (direct)
    // Actually our mock has Mom->Kid direct, so BFS should find direct [3, 2].
    // Let's create a scenario where path is indirect.
    // 4 is Dad's Brother. 1 -> 4.
    // Path from Kid(3) -> Uncle(4) should be 3 -> 1 -> 4.
    
    // Expand adjacency just for this test
    const extendedAdj = buildAdjacencyList([
      ...mockRelationships,
      { from_id: 1, to_id: 4, type: 'sibling' }
    ]);
    
    const path = bfsPath(3, 4, extendedAdj);
    expect(path).toEqual([3, 1, 4]);
  });

  test('getRelationshipLabel returns correct string', () => {
    // Dad(1) is Parent of Kid(3)
    expect(getRelationshipLabel(1, 3)).toBe("parent of");
    // Kid(3) is Child of Dad(1)
    expect(getRelationshipLabel(3, 1)).toBe("child of");
    // Dad(1) is Spouse of Mom(2)
    expect(getRelationshipLabel(1, 2)).toBe("spouse of");
  });

  test('getGenerationDelta calculates levels', () => {
    // Parent down to child = -1
    expect(getGenerationDelta(1, 3)).toBe(-1);
    // Child up to parent = +1
    expect(getGenerationDelta(3, 1)).toBe(1);
    // Spouses = 0
    expect(getGenerationDelta(1, 2)).toBe(0);
  });

  test('Returns empty/default for unknown relationships', () => {
    expect(getRelationshipLabel(1, 99)).toBe("");
    expect(getGenerationDelta(1, 99)).toBe(0);
  });
});
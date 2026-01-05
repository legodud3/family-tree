// Tiny, homegrown unit test harness for the family-tree app.

function assertEqual(name, actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  const pass = a === e;
  if (!pass) {
    console.error(`❌ ${name}: expected`, expected, "got", actual);
  } else {
    console.log(`✅ ${name}`);
  }
}

// Tests for the pure graph functions that don't depend on global data.
function testBfsWithSampleGraph() {
  const relationships = [
    { from_id: 1, to_id: 2, type: "parent" }, // 1 -> 2
    { from_id: 2, to_id: 3, type: "spouse" }  // 2 <-> 3
  ];
  const adj = buildAdjacencyList(relationships);

  assertEqual("bfs 1→2", bfsPath(1, 2, adj), [1, 2]);
  assertEqual("bfs 1→3", bfsPath(1, 3, adj), [1, 2, 3]);
  assertEqual("bfs 3→1", bfsPath(3, 1, adj), [3, 2, 1]);
  assertEqual("bfs 1→1", bfsPath(1, 1, adj), [1]);
}

// Tests that use the real app data (data.js)
function testRelationshipLabelsOnRealData() {
  // In your data: 3,4 are parents of 1; 5,6 are parents of 2; 1 & 2 are spouses.
  assertEqual("label Kedar→Chinmay", getRelationshipLabel(3, 1), "parent of");
  assertEqual("label Chinmay→Kedar", getRelationshipLabel(1, 3), "child of");

  assertEqual("label Jitendra→Sanjita", getRelationshipLabel(5, 2), "parent of");
  assertEqual("label Sanjita→Jitendra", getRelationshipLabel(2, 5), "child of");

  assertEqual("label Chinmay↔Sanjita", getRelationshipLabel(1, 2), "spouse of");
  assertEqual("label Sanjita↔Chinmay", getRelationshipLabel(2, 1), "spouse of");
}

function testGenerationDeltasOnRealData() {
  // 3 is parent of 1
  assertEqual("gen Chinmay→Kedar (child→parent)", getGenerationDelta(1, 3), 1);
  assertEqual("gen Kedar→Chinmay (parent→child)", getGenerationDelta(3, 1), -1);

  // 1 is parent of 7 (Jigglypuff)
  assertEqual("gen Chinmay→Jigglypuff (parent→child)", getGenerationDelta(1, 7), -1);
  assertEqual("gen Jigglypuff→Chinmay (child→parent)", getGenerationDelta(7, 1), 1);

  // 1 and 2 are spouses
  assertEqual("gen Chinmay↔Sanjita (spouse)", getGenerationDelta(1, 2), 0);
  assertEqual("gen Sanjita↔Chinmay (spouse)", getGenerationDelta(2, 1), 0);
}

function runAllTests() {
  console.groupCollapsed("family-tree unit tests");
  try {
    testBfsWithSampleGraph();
    testRelationshipLabelsOnRealData();
    testGenerationDeltasOnRealData();
  } catch (e) {
    console.error("❌ Test run crashed:", e);
  }
  console.groupEnd();
}

// Wait for the DOM (and thus data.js) to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    runAllTests();
});
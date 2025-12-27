// v0 data: 7 people
// 1: Chinmay Deo (me)
// 2: Sanjita Israni (wife)
// 3: Kedar Deo (father)
// 4: Nishigandha Deo (mother)
// 5: Jitendra Israni (father-in-law)
// 6: Taruna Israni (mother-in-law)
// 7: Jigglypuff (child)

const data = {
  people: [
    { id: 1, name: "Chinmay Deo" },
    { id: 2, name: "Sanjita Israni" },
    { id: 3, name: "Kedar Deo" },
    { id: 4, name: "Nishigandha Deo" },
    { id: 5, name: "Jitendra Israni" },
    { id: 6, name: "Taruna Israni" },
    { id: 7, name: "Jigglypuff" }
  ],
  relationships: [
    // Parents of Chinmay
    { from_id: 3, to_id: 1, type: "parent" }, // Kedar -> Chinmay
    { from_id: 4, to_id: 1, type: "parent" }, // Nishigandha -> Chinmay

    // Parents of Sanjita
    { from_id: 5, to_id: 2, type: "parent" }, // Jitendra -> Sanjita
    { from_id: 6, to_id: 2, type: "parent" }, // Taruna -> Sanjita

    // Spouses
    { from_id: 1, to_id: 2, type: "spouse" }, // Chinmay & Sanjita
    { from_id: 3, to_id: 4, type: "spouse" }, // Kedar & Nishigandha
    { from_id: 5, to_id: 6, type: "spouse" }, // Jitendra & Taruna

    // Parents of Jigglypuff
    { from_id: 1, to_id: 7, type: "parent" }, // Chinmay -> Jigglypuff
    { from_id: 2, to_id: 7, type: "parent" }  // Sanjita -> Jigglypuff
  ]
};
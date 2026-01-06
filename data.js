/* eslint-disable no-unused-vars */

// data.js
// Stores the "Source of Truth" for people and their connections.

const data = {
  // ME_ID: Who are "You"? (Set this to your own ID)
  ME_ID: 1,

  people: [
    { id: 1, name: 'Chinmay Deo' },
    { id: 2, name: 'Sanjita Israni' },
    { id: 3, name: 'Kedar Deo' },
    { id: 4, name: 'Nishigandha Deo' },
    { id: 5, name: 'Jitendra Israni' },
    { id: 6, name: 'Taruna Israni' },
    { id: 7, name: 'Jigglypuff' },
  ],

  relationships: [
    // Format: from_id is the reference, to_id is the relative
    { from_id: 3, to_id: 1, type: 'parent' }, // Kedar is parent of Chinmay
    { from_id: 4, to_id: 1, type: 'parent' }, // Nishi is parent of Chinmay

    // In-laws / Parents-in-law
    { from_id: 5, to_id: 2, type: 'parent' }, // Jitendra is parent of Sanjita
    { from_id: 6, to_id: 2, type: 'parent' }, // Taruna is parent of Sanjita

    // Spouses
    { from_id: 1, to_id: 2, type: 'spouse' }, // Chinmay + Sanjita
    { from_id: 3, to_id: 4, type: 'spouse' }, // Kedar + Nishi
    { from_id: 5, to_id: 6, type: 'spouse' }, // Jitendra + Taruna

    // The Kid
    { from_id: 1, to_id: 7, type: 'parent' }, // Chinmay is parent of Jigglypuff
    { from_id: 2, to_id: 7, type: 'parent' }, // Sanjita is parent of Jigglypuff
  ],
};

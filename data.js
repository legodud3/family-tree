/* eslint-disable no-unused-vars */

// data.js
// Stores the source of truth for people and their connections.

const data = {
  // ME_ID: Who are "You"? (Set this to your own ID)
  ME_ID: 1,

  people: [
    {
      id: 1,
      name: 'Chinmay Deo',
      display_name: 'Chinmay',
      nickname: 'Dad',
      pronouns: 'he/him',
      birth_year: 1992,
      tags: ['immediate-family'],
      notes: 'Builder of this project',
    },
    {
      id: 2,
      name: 'Sanjita Israni',
      display_name: 'Sanjita',
      pronouns: 'she/her',
      birth_year: 1993,
      tags: ['immediate-family'],
      notes: 'Co-parent + partner',
    },
    {
      id: 3,
      name: 'Kedar Deo',
      display_name: 'Kedar',
      tags: ['grandparent-line'],
      notes: 'Paternal line',
    },
    {
      id: 4,
      name: 'Nishigandha Deo',
      display_name: 'Nishigandha',
      tags: ['grandparent-line'],
    },
    {
      id: 5,
      name: 'Jitendra Israni',
      display_name: 'Jitendra',
      tags: ['grandparent-line'],
    },
    {
      id: 6,
      name: 'Taruna Israni',
      display_name: 'Taruna',
      tags: ['grandparent-line'],
    },
    {
      id: 7,
      name: 'Baby Deo',
      display_name: 'Little One',
      nickname: 'Jigglypuff',
      birth_year: 2025,
      tags: ['newborn', 'gift-project'],
      notes: 'Primary audience for this app 💛',
    },
  ],

  relationships: [
    // Format: from_id is the reference, to_id is the relative
    { from_id: 3, to_id: 1, type: 'parent', subtype: 'biological', confidence: 'confirmed' },
    { from_id: 4, to_id: 1, type: 'parent', subtype: 'biological', confidence: 'confirmed' },

    { from_id: 5, to_id: 2, type: 'parent', subtype: 'biological', confidence: 'confirmed' },
    { from_id: 6, to_id: 2, type: 'parent', subtype: 'biological', confidence: 'confirmed' },

    { from_id: 1, to_id: 2, type: 'spouse', since: '2020-01-01', confidence: 'confirmed' },
    { from_id: 3, to_id: 4, type: 'spouse', confidence: 'confirmed' },
    { from_id: 5, to_id: 6, type: 'spouse', confidence: 'confirmed' },

    { from_id: 1, to_id: 7, type: 'parent', subtype: 'biological', confidence: 'confirmed' },
    { from_id: 2, to_id: 7, type: 'parent', subtype: 'biological', confidence: 'confirmed' },
  ],
};

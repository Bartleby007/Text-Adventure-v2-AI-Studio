
export const ITEMS = {
  'rusty_key': {
    id: 'rusty_key',
    name: 'Rusty Key',
    description: 'A heavy iron key, pitted with age.',
    canTake: true
  },
  'old_torch': {
    id: 'old_torch',
    name: 'Unlit Torch',
    description: 'A wooden torch soaked in pitch. It looks dry enough to light.',
    canTake: true
  },
  'crystal_shard': {
    id: 'crystal_shard',
    name: 'Crystal Shard',
    description: 'A pulsing blue shard that hums softly in your hand.',
    canTake: true
  },
  'stone_altar': {
    id: 'stone_altar',
    name: 'Stone Altar',
    description: 'An ancient altar carved with forgotten runes.',
    canTake: false
  }
};

export const ROOMS = {
  'dungeon_cell': {
    id: 'dungeon_cell',
    name: 'Damp Cell',
    description: 'You awaken in a cold, damp cell. Moonlight filters through a high, barred window. The air smells of salt and old decay.',
    exits: { 'n': 'corridor_south' },
    items: ['old_torch']
  },
  'corridor_south': {
    id: 'corridor_south',
    name: 'Dungeon Corridor (South)',
    description: 'A long, narrow stone corridor. Torches sputter on the walls, providing flickering light.',
    exits: { 's': 'dungeon_cell', 'n': 'corridor_center', 'e': 'guard_room' },
    items: []
  },
  'guard_room': {
    id: 'guard_room',
    name: 'Guard Room',
    description: 'The room is messy, with overturned chairs and a thick layer of dust. The guards are long gone.',
    exits: { 'w': 'corridor_south' },
    items: ['rusty_key']
  },
  'corridor_center': {
    id: 'corridor_center',
    name: 'Central Junction',
    description: 'The corridor opens up into a cross-junction. To the east and west, heavy doors lead to unknown chambers.',
    exits: { 's': 'corridor_south', 'n': 'great_hall', 'w': 'alchemy_lab', 'e': 'armory' },
    items: []
  },
  'alchemy_lab': {
    id: 'alchemy_lab',
    name: 'Alchemy Laboratory',
    description: 'Broken glass and stained tables fill this room. A strange blue glow emanates from a corner.',
    exits: { 'e': 'corridor_center', 'nw': 'secret_nook' },
    items: ['crystal_shard']
  },
  'secret_nook': {
    id: 'secret_nook',
    name: 'Secret Nook',
    description: 'A tiny crawlspace hidden behind a sliding stone panel.',
    exits: { 'se': 'alchemy_lab' },
    items: []
  },
  'armory': {
    id: 'armory',
    name: 'Decrepit Armory',
    description: 'Racks of rusted swords and rotted leather armor line the walls.',
    exits: { 'w': 'corridor_center' },
    items: []
  },
  'great_hall': {
    id: 'great_hall',
    name: 'The Great Hall',
    description: 'A vast hall with a ceiling so high it vanishes into darkness. An ancient altar sits in the center.',
    exits: { 's': 'corridor_center', 'ne': 'balcony' },
    items: ['stone_altar']
  },
  'balcony': {
    id: 'balcony',
    name: 'Overlook Balcony',
    description: 'You stand on a balcony overlooking the sea. The cold wind whips through your hair.',
    exits: { 'sw': 'great_hall' },
    items: []
  }
};

export const INITIAL_ROOM_ID = 'dungeon_cell';

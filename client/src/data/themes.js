export const themeList = [
  {
    id: 'fast_food',
    name: 'Fast Food',
    emoji: '🍔',
    description: 'Guess the chain from its brand colors!',
    characterCount: 17
  },
  {
    id: 'us_tech',
    name: 'Tech Giants',
    emoji: '💻',
    description: 'Guess the tech company from its brand colors!',
    characterCount: 10
  },
  {
    id: 'drinks',
    name: 'Drinks & Sodas',
    emoji: '🥤',
    description: 'Guess the drink brand from its colors!',
    characterCount: 9
  },
  {
    id: 'disney_princess',
    name: 'Disney Princesses',
    emoji: '👸',
    description: 'Guess the princess from her colors!',
    characterCount: 14
  },
  {
    id: 'disney_classic',
    name: 'Classic Disney',
    emoji: '🏰',
    description: 'Guess the classic Disney character!',
    characterCount: 6
  }
];

export function getThemeName(id) {
  return themeList.find(t => t.id === id)?.name || id;
}

export function getThemeEmoji(id) {
  return themeList.find(t => t.id === id)?.emoji || '🎮';
}

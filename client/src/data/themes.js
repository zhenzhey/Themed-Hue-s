export const themeList = [
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

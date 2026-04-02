export const avatarColors = [
  { id: 1,  gradient: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)', name: 'Cherry',      solid: '#FF85A8' },
  { id: 2,  gradient: 'linear-gradient(135deg, #E6D8FF 0%, #9B59B6 100%)', name: 'Lavender',    solid: '#B07FE0' },
  { id: 3,  gradient: 'linear-gradient(135deg, #B8E4FF 0%, #5BA8D4 100%)', name: 'Sky',         solid: '#6FB8E8' },
  { id: 4,  gradient: 'linear-gradient(135deg, #B8F0D8 0%, #27AE60 100%)', name: 'Mint',        solid: '#5EC990' },
  { id: 5,  gradient: 'linear-gradient(135deg, #FFE0CC 0%, #FF7A45 100%)', name: 'Peach',       solid: '#FF9B6A' },
  { id: 6,  gradient: 'linear-gradient(135deg, #FFF5B8 0%, #F5C842 100%)', name: 'Lemon',       solid: '#FAD852' },
  { id: 7,  gradient: 'linear-gradient(135deg, #FFD4D0 0%, #E74C3C 100%)', name: 'Rose',        solid: '#F06B5C' },
  { id: 8,  gradient: 'linear-gradient(135deg, #D0F0E8 0%, #1ABC9C 100%)', name: 'Jade',        solid: '#48C9AC' },
  { id: 9,  gradient: 'linear-gradient(135deg, #F0D4FF 0%, #DA70D6 100%)', name: 'Lilac',       solid: '#E890DF' },
  { id: 10, gradient: 'linear-gradient(135deg, #C8E8FF 0%, #2980B9 100%)', name: 'Cornflower',  solid: '#5BA0D0' },
  { id: 11, gradient: 'linear-gradient(135deg, #FFECD8 0%, #F39C12 100%)', name: 'Amber',       solid: '#F8B44A' },
  { id: 12, gradient: 'linear-gradient(135deg, #D4E8FF 0%, #3498DB 100%)', name: 'Sapphire',    solid: '#6EB0E8' },
  { id: 13, gradient: 'linear-gradient(135deg, #FFD4E8 0%, #E91E63 100%)', name: 'Peony',       solid: '#F05090' },
  { id: 14, gradient: 'linear-gradient(135deg, #E0D4FF 0%, #7C3AED 100%)', name: 'Violet',      solid: '#9B6AEF' },
  { id: 15, gradient: 'linear-gradient(135deg, #C8F8F8 0%, #00BCD4 100%)', name: 'Cyan',        solid: '#40D8E8' },
  { id: 16, gradient: 'linear-gradient(135deg, #FFD8C8 0%, #FF5722 100%)', name: 'Coral',       solid: '#FF7A50' },
  { id: 17, gradient: 'linear-gradient(135deg, #D4FFE8 0%, #00C853 100%)', name: 'Apple',       solid: '#40D880' },
  { id: 18, gradient: 'linear-gradient(135deg, #FFE8F4 0%, #F06292 100%)', name: 'Bubblegum',   solid: '#F880B0' },
];

export const defaultAvatar = avatarColors[0];

export function getAvatarById(id) {
  return avatarColors.find(a => a.id === id) || defaultAvatar;
}

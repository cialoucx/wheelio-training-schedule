export interface AvatarTone {
  bgcolor: string;
  color: string;
}
export const avatarTone = (name: string, isDark: boolean): AvatarTone => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 360;
  }
  const hue = Math.abs(hash);

  return isDark
    ? { bgcolor: `hsl(${hue}, 32%, 24%)`, color: `hsl(${hue}, 62%, 78%)` }
    : { bgcolor: `hsl(${hue}, 58%, 93%)`, color: `hsl(${hue}, 55%, 26%)` };
};

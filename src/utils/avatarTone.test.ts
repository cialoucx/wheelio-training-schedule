import { describe, expect, it } from 'vitest';

import { avatarTone } from './avatarTone';

describe('avatarTone', () => {
  it('is stable for the same name', () => {
    expect(avatarTone('Alex Thompson', false)).toEqual(avatarTone('Alex Thompson', false));
  });

  it('gives different names different hues', () => {
    const a = avatarTone('Alex Thompson', false);
    const b = avatarTone('Mia Johnson', false);

    expect(a.bgcolor).not.toBe(b.bgcolor);
  });

  it('varies only the hue, so tints never reach status saturation', () => {
    for (const name of ['Alex Thompson', 'Mia Johnson', 'Zoe Baker', '']) {
      expect(avatarTone(name, false).bgcolor).toMatch(/^hsl\(\d+, 58%, 93%\)$/);
      expect(avatarTone(name, true).bgcolor).toMatch(/^hsl\(\d+, 32%, 24%\)$/);
    }
  });

  it('returns a usable tone for an empty name', () => {
    expect(avatarTone('', false)).toHaveProperty('bgcolor');
  });
});

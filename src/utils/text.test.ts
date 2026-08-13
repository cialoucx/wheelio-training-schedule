import { describe, expect, it } from 'vitest';
import { initials } from './text';

describe('initials', () => {
  it('takes the first and last initial, not the first two words', () => {
    expect(initials('Jonalyn Mae Alag')).toBe('JA');
    expect(initials('Alex Thompson')).toBe('AT');
  });

  it('repeats nothing for a single name', () => {
    expect(initials('Cher')).toBe('C');
  });

  it('tolerates extra whitespace', () => {
    expect(initials('  Emily   Chen  ')).toBe('EC');
  });

  it('returns an empty string for an empty name', () => {
    expect(initials('')).toBe('');
    expect(initials('   ')).toBe('');
  });
});

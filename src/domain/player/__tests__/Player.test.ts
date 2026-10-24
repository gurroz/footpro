/**
 * @format
 */

import {
  createPlayer,
  isValidEmail,
  isValidPlayerInput,
} from '../Player';

describe('Player domain', () => {
  describe('isValidEmail', () => {
    it('accepts a simple address', () => {
      expect(isValidEmail('a@b.co')).toBe(true);
    });

    it('rejects empty or invalid', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('not-an-email')).toBe(false);
    });
  });

  describe('isValidPlayerInput', () => {
    it('requires non-empty name and valid email', () => {
      expect(
        isValidPlayerInput({ name: 'Jo', email: 'j@x.com', phone: '' }),
      ).toBe(true);
      expect(isValidPlayerInput({ name: '', email: 'j@x.com' })).toBe(false);
      expect(isValidPlayerInput({ name: 'Jo', email: 'bad' })).toBe(false);
    });
  });

  describe('createPlayer', () => {
    it('trims fields and defaults phone', () => {
      const p = createPlayer({
        name: '  Alex  ',
        email: ' alex@team.com ',
        phone: '  +1 ',
      });
      expect(p.name).toBe('Alex');
      expect(p.email).toBe('alex@team.com');
      expect(p.phone).toBe('+1');
    });

    it('allows empty phone', () => {
      const p = createPlayer({ name: 'Alex', email: 'a@b.co' });
      expect(p.phone).toBe('');
    });
  });
});

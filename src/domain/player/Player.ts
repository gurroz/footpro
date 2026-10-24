/**
 * Squad member during team creation (import step). Persistence via {@link TeamRosterRepository}.
 */
export type PlayerId = string;

export type Player = {
  id: PlayerId;
  name: string;
  email: string;
  /** Empty string when unset. */
  phone: string;
};

let playerIdCounter = 0;

function nextPlayerId(): PlayerId {
  playerIdCounter += 1;
  return `player_${playerIdCounter}`;
}

export function createPlayer(
  fields: Pick<Player, 'name' | 'email'> & { phone?: string },
  overrides?: Partial<Player>,
): Player {
  const base: Player = {
    id: nextPlayerId(),
    name: fields.name.trim(),
    email: fields.email.trim(),
    phone: (fields.phone ?? '').trim(),
  };
  return overrides
    ? { ...base, ...overrides, id: overrides.id ?? base.id }
    : base;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  const t = email.trim();
  return t.length > 0 && EMAIL_RE.test(t);
}

export function isValidPlayerInput(input: {
  name: string;
  email: string;
  phone?: string;
}): boolean {
  return (
    input.name.trim().length > 0 &&
    isValidEmail(input.email)
  );
}

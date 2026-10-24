/**
 * Domain model for a football team (creation flow step 1 fields).
 * Persistence is handled elsewhere via {@link TeamRepository}.
 */
export type TeamId = string;

export type Team = {
  id: TeamId;
  name: string;
  /** Display label for the selected country (empty when unset). */
  country: string;
  city: string;
  logoUri: string | null;
  pitchPlayers: number;
  substitutes: number;
  homePitchLocation: string;
  league: string;
  externalClubLink: string;
  description: string;
};

let teamIdCounter = 0;

function nextTeamId(): TeamId {
  teamIdCounter += 1;
  return `team_${teamIdCounter}`;
}

export function createNewTeam(overrides?: Partial<Team>): Team {
  const base: Team = {
    id: nextTeamId(),
    name: '',
    country: '',
    city: '',
    logoUri: null,
    pitchPlayers: 11,
    substitutes: 7,
    homePitchLocation: '',
    league: '',
    externalClubLink: '',
    description: '',
  };
  return overrides ? { ...base, ...overrides, id: overrides.id ?? base.id } : base;
}

/** Max logo file size aligned with UI copy (2MB). */
export const MAX_TEAM_LOGO_BYTES = 2 * 1024 * 1024;

export function isLogoWithinSizeLimit(bytes: number | undefined): boolean {
  if (bytes == null) {
    return true;
  }
  return bytes <= MAX_TEAM_LOGO_BYTES;
}

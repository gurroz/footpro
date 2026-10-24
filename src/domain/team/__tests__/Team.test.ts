import {
  createNewTeam,
  isLogoWithinSizeLimit,
  MAX_TEAM_LOGO_BYTES,
} from '../Team';

describe('Team domain', () => {
  it('createNewTeam returns defaults for step 1', () => {
    const team = createNewTeam();
    expect(team.name).toBe('');
    expect(team.country).toBe('');
    expect(team.city).toBe('');
    expect(team.logoUri).toBeNull();
    expect(team.pitchPlayers).toBe(11);
    expect(team.substitutes).toBe(7);
    expect(team.homePitchLocation).toBe('');
    expect(team.league).toBe('');
    expect(team.externalClubLink).toBe('');
    expect(team.description).toBe('');
    expect(team.id).toMatch(/^team_\d+$/);
  });

  it('createNewTeam merges overrides', () => {
    const team = createNewTeam({
      id: 'fixed-id',
      name: 'Test FC',
      pitchPlayers: 10,
    });
    expect(team.id).toBe('fixed-id');
    expect(team.name).toBe('Test FC');
    expect(team.pitchPlayers).toBe(10);
    expect(team.substitutes).toBe(7);
  });

  it('isLogoWithinSizeLimit allows missing size', () => {
    expect(isLogoWithinSizeLimit(undefined)).toBe(true);
  });

  it('isLogoWithinSizeLimit enforces max', () => {
    expect(isLogoWithinSizeLimit(MAX_TEAM_LOGO_BYTES)).toBe(true);
    expect(isLogoWithinSizeLimit(MAX_TEAM_LOGO_BYTES + 1)).toBe(false);
  });
});

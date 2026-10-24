import type { Team } from './Team';

/**
 * Abstraction over how teams are stored. No concrete implementation here.
 */
export interface TeamRepository {
  saveCreationDraft(team: Team): Promise<void>;
}

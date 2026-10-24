import type { Player } from './Player';
import type { TeamId } from '../team/Team';

/**
 * Abstraction for persisting roster data. No implementation in this app yet.
 */
export interface TeamRosterRepository {
  persistImportedPlayers(teamId: TeamId, players: Player[]): Promise<void>;
}

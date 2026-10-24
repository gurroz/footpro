import type { Player } from '../../../domain/player';
import type { Team } from '../../../domain/team';
import { useMemo, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import {
  createNativeContactsDirectory,
  createNativeImageLibrary,
  TeamConfigurationStep1Screen,
  TeamImportPlayersScreen,
} from '../../teams';
import {
  AppBar,
  BottomNav,
  Chip,
  GrassFab,
  IconCircleButton,
  PitchPreview,
  PlayerPitchMarker,
  PlayerRowCard,
  PrimaryGradientButton,
  ProgressTracker,
  SectionHeader,
  StatTile,
  TeamCard,
} from '../../../shared/components';

const SAMPLE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5phsKLhV42vehVz1eUziI4vej8FBW7vRR97b7QGALavPV3H4LrswuRWifNTS24JreexwJm3QX79EFLUH9sQtyp5nIId0uKHYel62HjL5WZWMKGllKw5MUd0ZSQ1-1s_1koQqIGsJI-9N-nCi2LoyIHRYpqq5kF5sCckdETcg8f-FuvHpR8TC36sXFR1TPZ2d7oMJGeI6b944yFsKyyjD6wXXgKwjnXJS1bWDjg4DI2G4KEsRVmuVnFN2AwrRxJERQ04T_4pGZ7q0';

const NAV_ITEMS = [
  { id: 'teams', label: 'Teams', icon: 'group' },
  { id: 'players', label: 'Players', icon: 'person-search' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
] as const;

export function HomeScreen() {
  const { theme } = useUnistyles();
  const [tab, setTab] = useState('teams');
  const [teamCreationStep, setTeamCreationStep] = useState<0 | 1 | 2>(0);
  const [draftTeam, setDraftTeam] = useState<Team | null>(null);
  const [draftPlayers, setDraftPlayers] = useState<Player[]>([]);
  const imageLibrary = useMemo(() => createNativeImageLibrary(), []);
  const contactsDirectory = useMemo(
    () => createNativeContactsDirectory(),
    [],
  );

  const closeTeamCreation = () => {
    setTeamCreationStep(0);
    setDraftTeam(null);
    setDraftPlayers([]);
  };

  const openTeamCreation = () => {
    setDraftTeam(null);
    setDraftPlayers([]);
    setTeamCreationStep(1);
  };

  if (teamCreationStep === 1) {
    return (
      <TeamConfigurationStep1Screen
        imageLibrary={imageLibrary}
        initialTeam={draftTeam ?? undefined}
        onBack={closeTeamCreation}
        onConfirmNext={team => {
          setDraftTeam(team);
          setTeamCreationStep(2);
        }}
      />
    );
  }

  if (teamCreationStep === 2 && draftTeam != null) {
    return (
      <TeamImportPlayersScreen
        team={draftTeam}
        contactsDirectory={contactsDirectory}
        initialPlayers={draftPlayers}
        onBack={() => setTeamCreationStep(1)}
        onConfirmNext={players => {
          setDraftPlayers(players);
          closeTeamCreation();
        }}
      />
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <AppBar
        title="The Pitch"
        rightSlot={
          <View style={styles.appBarRight}>
            <IconCircleButton icon="search" />
            <Image
              source={{ uri: SAMPLE }}
              style={styles.avatarSm}
            />
          </View>
        }
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <SectionHeader
          kicker="Season 2024/25"
          title="Design kit"
        />
        <ProgressTracker
          stepLabel="Step 01"
          title="Import Squad"
          progress={0.33}
          description="Shared components mapped from Stitch HTML + DESIGN.md."
        />
        <View style={styles.rowTiles}>
          <StatTile label="Total Assets" value="42" emphasize />
          <StatTile label="Avg. Readiness" value="94%" emphasize />
        </View>
        <PitchPreview />
        <Text style={styles.sectionLabel}>TeamCard</Text>
        <TeamCard
          teamName="North Star Elite"
          playerLine="24 Players Active"
          rankLabel="#01"
          logoSource={{ uri: SAMPLE }}
          stackSources={[{ uri: SAMPLE }, { uri: SAMPLE }]}
          extraCount={22}
        />
        <Text style={styles.sectionLabel}>PlayerPitchMarker</Text>
        <View style={styles.pitchRow}>
          <PlayerPitchMarker source={{ uri: SAMPLE }} name="G. SMITH" size={48} ring />
        </View>
        <Text style={styles.sectionLabel}>PlayerRowCard</Text>
        <PlayerRowCard
          name="Julian Draxler"
          subtitle="AMF • ATT 84 • FIT 92%"
          rating="8.4"
          source={{ uri: SAMPLE }}
          formDots={2}
        />
        <PrimaryGradientButton title="Primary action" fullWidth />
        <View style={styles.chipRow}>
          <Chip label="Away" variant="primary" />
          <Chip label="Home" variant="neutral" />
        </View>
      </ScrollView>
      {tab === 'teams' ? (
        <View style={styles.fabWrap}>
          <GrassFab onPress={openTeamCreation} />
        </View>
      ) : null}
      <BottomNav
        items={[...NAV_ITEMS]}
        activeId={tab}
        onSelect={setTab}
      />
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: 120,
    gap: theme.spacing[6],
  },
  appBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  avatarSm: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.primaryContainer,
  },
  rowTiles: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  pitchRow: {
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
  },
  sectionLabel: {
    ...theme.typography.label,
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  chipRow: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    flexWrap: 'wrap',
  },
  fabWrap: {
    position: 'absolute',
    right: theme.spacing[6],
    bottom: 100,
    zIndex: 40,
  },
}));

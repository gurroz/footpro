import { useCallback, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import {
  createNewTeam,
  isLogoWithinSizeLimit,
  type Team,
} from '../../../domain/team';
import {
  AppBar,
  AppIcon,
  PrimaryGradientButton,
  SurfaceCard,
} from '../../../shared/components';
import type { ImageLibraryPort } from '../ports/ImageLibraryPort';

export const TEAM_CREATION_COUNTRY_OPTIONS = [
  'Spain',
  'England',
  'Germany',
  'Italy',
] as const;

export type TeamConfigurationStep1ScreenProps = {
  imageLibrary: ImageLibraryPort;
  onBack: () => void;
  onConfirmNext?: (team: Team) => void;
  initialTeam?: Partial<Team>;
};

export function TeamConfigurationStep1Screen({
  imageLibrary,
  onBack,
  onConfirmNext,
  initialTeam,
}: TeamConfigurationStep1ScreenProps) {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const [team, setTeam] = useState<Team>(() =>
    createNewTeam({ ...initialTeam }),
  );
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  const update = useCallback((patch: Partial<Team>) => {
    setTeam(prev => ({ ...prev, ...patch }));
  }, []);

  const pickLogo = useCallback(async () => {
    setLogoError(null);
    const picked = await imageLibrary.pickImage();
    if (picked == null) {
      return;
    }
    if (!isLogoWithinSizeLimit(picked.fileSize)) {
      setLogoError(`Image must be at most ${MAX_LOGO_LABEL}.`);
      return;
    }
    update({ logoUri: picked.uri });
  }, [imageLibrary, update]);

  const onConfirm = useCallback(() => {
    onConfirmNext?.(team);
  }, [onConfirmNext, team]);

  return (
    <View
      style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <AppBar
        variant="back"
        title="Team Configuration"
        onLeftPress={onBack}
        trailingLabel="Step 1/3"
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Initial Setup</Text>
          </View>
          <Text style={styles.heroTitle}>
            IDENTITY &{'\n'}STRUCTURE
          </Text>
          <Text style={styles.heroSubtitle}>
            Define your club&apos;s core identity. This data forms the tactical
            foundation of your team&apos;s digital playbook.
          </Text>
        </View>

        <View style={styles.bentoRow}>
          <SurfaceCard style={styles.logoCard}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Upload team logo"
              testID="team-step1-logo-trigger"
              onPress={pickLogo}
              style={styles.logoHit}>
              <View style={styles.logoCircle}>
                {team.logoUri ? (
                  <Image
                    source={{ uri: team.logoUri }}
                    style={styles.logoImage}
                  />
                ) : (
                  <AppIcon
                    name="sports-soccer"
                    size={56}
                    color={theme.colors.outlineVariant}
                  />
                )}
                <View style={styles.logoOverlay}>
                  <AppIcon name="upload" size={28} color={theme.colors.primary} />
                </View>
              </View>
            </Pressable>
            <Text style={styles.logoCta}>Upload Team Logo</Text>
            <Text style={styles.logoHint}>
              SVG, PNG, or JPG (Max {MAX_LOGO_LABEL})
            </Text>
            {logoError ? (
              <Text style={styles.logoError}>{logoError}</Text>
            ) : null}
          </SurfaceCard>

          <SurfaceCard style={styles.fieldsCard}>
            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>Team Name</Text>
              <TextInput
                testID="team-step1-name-input"
                value={team.name}
                onChangeText={text => update({ name: text })}
                placeholder="e.g. Royal Madrid F.C."
                placeholderTextColor={`${theme.colors.outlineVariant}80`}
                style={[
                  styles.inputLg,
                  { color: theme.colors.onSurface },
                ]}
              />
            </View>
            <View style={styles.twoCol}>
              <View style={[styles.fieldBlock, styles.twoColCell]}>
                <Text style={styles.inputLabel}>Country</Text>
                <Pressable
                  testID="team-step1-country-trigger"
                  onPress={() => setCountryModalVisible(true)}
                  style={[
                    styles.selectField,
                    { backgroundColor: theme.colors.surfaceContainerLowest },
                  ]}>
                  <Text
                    style={[
                      styles.selectText,
                      {
                        color: team.country
                          ? theme.colors.onSurface
                          : `${theme.colors.outlineVariant}99`,
                      },
                    ]}
                    numberOfLines={1}>
                    {team.country || 'Select Country'}
                  </Text>
                  <AppIcon
                    name="expand-more"
                    size={22}
                    color={theme.colors.outlineVariant}
                  />
                </Pressable>
              </View>
              <View style={[styles.fieldBlock, styles.twoColCell]}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  testID="team-step1-city-input"
                  value={team.city}
                  onChangeText={text => update({ city: text })}
                  placeholder="Madrid"
                  placeholderTextColor={`${theme.colors.outlineVariant}80`}
                  style={[
                    styles.inputSm,
                    {
                      backgroundColor: theme.colors.surfaceContainerLowest,
                      color: theme.colors.onSurface,
                    },
                  ]}
                />
              </View>
            </View>
          </SurfaceCard>
        </View>

        <View
          style={[
            styles.squadSection,
            { backgroundColor: theme.colors.surfaceContainerHigh },
          ]}>
          <Text style={styles.squadWatermark}>SQUAD</Text>
          <View style={styles.squadHeadingRow}>
            <View
              style={[
                styles.squadAccent,
                { backgroundColor: theme.colors.primary },
              ]}
            />
            <Text style={styles.squadTitle}>SQUAD RATIO</Text>
          </View>
          <View style={styles.squadGrid}>
            <SurfaceCard style={styles.squadCard}>
              <View style={styles.squadRow}>
                <View
                  style={[
                    styles.squadIconWrap,
                    { backgroundColor: `${theme.colors.primary}1a` },
                  ]}>
                  <AppIcon name="groups" size={32} color={theme.colors.primary} />
                </View>
                <View style={styles.squadField}>
                  <Text style={styles.squadFieldLabel}>Pitch Players</Text>
                  <TextInput
                    testID="team-step1-pitch-players-input"
                    keyboardType="number-pad"
                    value={String(team.pitchPlayers)}
                    onChangeText={text => {
                      const n = parseInt(text.replace(/\D/g, ''), 10);
                      if (Number.isNaN(n)) {
                        update({ pitchPlayers: 0 });
                        return;
                      }
                      update({ pitchPlayers: n });
                    }}
                    style={[
                      styles.squadNumber,
                      { color: theme.colors.onSurface },
                    ]}
                  />
                </View>
              </View>
            </SurfaceCard>
            <SurfaceCard style={styles.squadCard}>
              <View style={styles.squadRow}>
                <View
                  style={[
                    styles.squadIconWrap,
                    { backgroundColor: theme.colors.secondaryContainer },
                  ]}>
                  <AppIcon
                    name="person-add"
                    size={32}
                    color={theme.colors.secondary}
                  />
                </View>
                <View style={styles.squadField}>
                  <Text style={styles.squadFieldLabel}>Substitutes</Text>
                  <TextInput
                    testID="team-step1-subs-input"
                    keyboardType="number-pad"
                    value={String(team.substitutes)}
                    onChangeText={text => {
                      const n = parseInt(text.replace(/\D/g, ''), 10);
                      if (Number.isNaN(n)) {
                        update({ substitutes: 0 });
                        return;
                      }
                      update({ substitutes: n });
                    }}
                    style={[
                      styles.squadNumber,
                      { color: theme.colors.onSurface },
                    ]}
                  />
                </View>
              </View>
            </SurfaceCard>
          </View>
        </View>

        <View style={styles.optionalHeader}>
          <Text style={styles.optionalKicker}>Optional Data</Text>
          <View
            style={[
              styles.optionalRule,
              { backgroundColor: `${theme.colors.outlineVariant}33` },
            ]}
          />
        </View>
        <View style={styles.optionalGrid}>
          <View style={styles.optionalCol}>
            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>Home Pitch Location</Text>
              <View
                style={[
                  styles.inlineInputRow,
                  { backgroundColor: theme.colors.surfaceContainerLow },
                ]}>
                <AppIcon
                  name="place"
                  size={18}
                  color={theme.colors.outlineVariant}
                />
                <TextInput
                  testID="team-step1-home-pitch-input"
                  value={team.homePitchLocation}
                  onChangeText={text => update({ homePitchLocation: text })}
                  placeholder="Stadium name or address"
                  placeholderTextColor={`${theme.colors.outlineVariant}80`}
                  style={[styles.inputSm, styles.homePitchInput]}
                />
              </View>
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>Current League</Text>
              <TextInput
                testID="team-step1-league-input"
                value={team.league}
                onChangeText={text => update({ league: text })}
                placeholder="e.g. La Liga"
                placeholderTextColor={`${theme.colors.outlineVariant}80`}
                style={[
                  styles.inputSm,
                  {
                    backgroundColor: theme.colors.surfaceContainerLow,
                    color: theme.colors.onSurface,
                  },
                ]}
              />
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>External Club Link</Text>
              <TextInput
                testID="team-step1-link-input"
                value={team.externalClubLink}
                onChangeText={text => update({ externalClubLink: text })}
                placeholder="https://clubsite.com"
                placeholderTextColor={`${theme.colors.outlineVariant}80`}
                autoCapitalize="none"
                keyboardType="url"
                style={[
                  styles.inputSm,
                  {
                    backgroundColor: theme.colors.surfaceContainerLow,
                    color: theme.colors.onSurface,
                  },
                ]}
              />
            </View>
          </View>
          <View style={styles.optionalCol}>
            <Text style={styles.inputLabel}>Club Philosophy / Description</Text>
            <TextInput
              testID="team-step1-description-input"
              value={team.description}
              onChangeText={text => update({ description: text })}
              placeholder="Enter team history, mission or tactical philosophy..."
              placeholderTextColor={`${theme.colors.outlineVariant}80`}
              multiline
              textAlignVertical="top"
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.colors.surfaceContainerLow,
                  color: theme.colors.onSurface,
                },
              ]}
            />
          </View>
        </View>
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom, theme.spacing[4]),
            backgroundColor: theme.colors.background,
          },
        ]}>
        <PrimaryGradientButton
          testID="team-step1-confirm"
          title="Confirm & Next"
          endIcon="arrow-forward"
          onPress={onConfirm}
        />
      </View>

      <Modal
        visible={countryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCountryModalVisible(false)}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setCountryModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Select country</Text>
            {TEAM_CREATION_COUNTRY_OPTIONS.map(country => (
              <Pressable
                key={country}
                testID={`team-step1-country-${country}`}
                onPress={() => {
                  update({ country });
                  setCountryModalVisible(false);
                }}
                style={styles.modalRow}>
                <Text style={styles.modalRowText}>{country}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const MAX_LOGO_LABEL = '2MB';

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[4],
    gap: theme.spacing[8],
  },
  hero: {
    gap: theme.spacing[4],
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radii.sm,
    transform: [{ rotate: '-2deg' }],
  },
  heroBadgeText: {
    ...theme.typography.headline,
    fontSize: 12,
    color: theme.colors.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    ...theme.typography.headline,
    fontSize: theme.typography.displayLg,
    lineHeight: theme.typography.displayLg + 4,
    color: theme.colors.onBackground,
  },
  heroSubtitle: {
    ...theme.typography.body,
    fontSize: theme.typography.bodyLg,
    color: theme.colors.onSurfaceVariant,
    maxWidth: 360,
  },
  bentoRow: {
    gap: theme.spacing[6],
  },
  logoCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
  },
  logoHit: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: `${theme.colors.outlineVariant}4d`,
    backgroundColor: theme.colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: theme.spacing[6],
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.colors.primary}1a`,
    opacity: 0,
  },
  logoCta: {
    ...theme.typography.headline,
    fontSize: 14,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  logoHint: {
    ...theme.typography.label,
    fontSize: theme.typography.caption,
    color: theme.colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: theme.spacing[2],
    textAlign: 'center',
  },
  logoError: {
    ...theme.typography.label,
    fontSize: theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing[2],
    textAlign: 'center',
  },
  fieldsCard: {
    gap: theme.spacing[6],
  },
  fieldBlock: {
    gap: theme.spacing[2],
  },
  inputLabel: {
    ...theme.typography.label,
    fontSize: theme.typography.labelSm,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  inputLg: {
    ...theme.typography.headline,
    fontSize: theme.typography.bodyLg,
    fontWeight: '600',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.surfaceContainerLowest,
  },
  inputSm: {
    ...theme.typography.body,
    fontSize: 14,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderRadius: theme.radii.sm,
  },
  twoCol: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  twoColCell: {
    flex: 1,
    minWidth: 0,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderRadius: theme.radii.sm,
  },
  selectText: {
    ...theme.typography.body,
    flex: 1,
    fontSize: 14,
  },
  squadSection: {
    borderRadius: theme.radii.xl,
    padding: theme.spacing[8],
    overflow: 'hidden',
  },
  squadWatermark: {
    position: 'absolute',
    right: -theme.spacing[2],
    bottom: -theme.spacing[4],
    ...theme.typography.headline,
    fontSize: 72,
    color: `${theme.colors.outlineVariant}14`,
  },
  squadHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[8],
  },
  squadAccent: {
    width: 32,
    height: 4,
    borderRadius: theme.radii.pill,
  },
  squadTitle: {
    ...theme.typography.headline,
    fontSize: theme.typography.titleLg,
    color: theme.colors.onBackground,
  },
  squadGrid: {
    gap: theme.spacing[6],
  },
  squadCard: {
    padding: theme.spacing[6],
  },
  squadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[6],
  },
  squadIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squadField: {
    flex: 1,
    gap: theme.spacing[1],
  },
  squadFieldLabel: {
    ...theme.typography.label,
    fontSize: theme.typography.labelSm,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  squadNumber: {
    ...theme.typography.headline,
    fontSize: 36,
    fontWeight: '900',
    padding: 0,
    margin: 0,
  },
  optionalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  optionalKicker: {
    ...theme.typography.headline,
    fontSize: theme.typography.labelSm,
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  optionalRule: {
    flex: 1,
    height: 1,
  },
  optionalGrid: {
    gap: theme.spacing[8],
  },
  optionalCol: {
    gap: theme.spacing[6],
  },
  inlineInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.radii.sm,
  },
  homePitchInput: {
    ...theme.typography.body,
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 0,
    paddingVertical: theme.spacing[3],
    color: theme.colors.onSurface,
  },
  textArea: {
    ...theme.typography.body,
    fontSize: 14,
    minHeight: 160,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderRadius: theme.radii.sm,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[4],
    alignItems: 'flex-end',
    ...theme.ambientShadowUp,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(40, 47, 63, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[6],
  },
  modalSheet: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.radii.xl,
    padding: theme.spacing[4],
    gap: theme.spacing[1],
    ...theme.ambientShadow,
  },
  modalTitle: {
    ...theme.typography.title,
    fontSize: theme.typography.titleLg,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing[2],
  },
  modalRow: {
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[2],
  },
  modalRowText: {
    ...theme.typography.body,
    fontSize: theme.typography.bodyLg,
    color: theme.colors.onSurface,
  },
}));

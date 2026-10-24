import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import {
  createPlayer,
  isValidPlayerInput,
  type Player,
} from '../../../domain/player';
import type { Team } from '../../../domain/team';
import {
  AppBar,
  AppIcon,
  PrimaryGradientButton,
  ProgressTracker,
  SurfaceCard,
} from '../../../shared/components';
import type { ContactRow, ContactsDirectoryPort } from '../ports/ContactsDirectoryPort';

export type TeamImportPlayersScreenProps = {
  team: Team;
  contactsDirectory: ContactsDirectoryPort;
  initialPlayers?: Player[];
  onBack: () => void;
  onConfirmNext?: (players: Player[]) => void;
};

function mergeUniqueByEmail(existing: Player[], incoming: Player[]): Player[] {
  const seen = new Set(existing.map(p => p.email.toLowerCase()));
  const out = [...existing];
  for (const p of incoming) {
    const k = p.email.toLowerCase();
    if (!seen.has(k)) {
      seen.add(k);
      out.push(p);
    }
  }
  return out;
}

export function TeamImportPlayersScreen({
  team,
  contactsDirectory,
  initialPlayers = [],
  onBack,
  onConfirmNext,
}: TeamImportPlayersScreenProps) {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const [players, setPlayers] = useState<Player[]>(() => [...initialPlayers]);
  const [manualOpen, setManualOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);
  const [contactRows, setContactRows] = useState<ContactRow[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [contactsLoading, setContactsLoading] = useState(false);

  const withEmail = useMemo(
    () => contactRows.filter(c => c.email && c.email.length > 0),
    [contactRows],
  );

  const removePlayer = useCallback((id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  }, []);

  const submitManual = useCallback(() => {
    setManualError(null);
    const input = {
      name: manualName,
      email: manualEmail,
      phone: manualPhone,
    };
    if (!isValidPlayerInput(input)) {
      setManualError('Enter a name and a valid email.');
      return;
    }
    const next = createPlayer({
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim(),
    });
    if (players.some(p => p.email.toLowerCase() === next.email.toLowerCase())) {
      setManualError('A player with this email is already on the list.');
      return;
    }
    setPlayers(prev => [...prev, next]);
    setManualName('');
    setManualEmail('');
    setManualPhone('');
    setManualOpen(false);
  }, [manualEmail, manualName, manualPhone, players]);

  const openContacts = useCallback(async () => {
    setContactsLoading(true);
    setSelectedContactIds(new Set());
    try {
      const ok = await contactsDirectory.requestPermission();
      if (!ok) {
        Alert.alert(
          'Contacts',
          'Permission is required to read contacts for import.',
        );
        setContactsLoading(false);
        return;
      }
      const rows = await contactsDirectory.listContacts();
      setContactRows(rows);
      setContactsOpen(true);
    } catch (e) {
      if (__DEV__) {
        console.warn('Contacts import failed', e);
      }
      const detail =
        e != null && typeof e === 'object' && 'message' in e
          ? String((e as { message?: unknown }).message)
          : e != null
            ? String(e)
            : '';
      Alert.alert(
        'Contacts',
        __DEV__ && detail.length > 0
          ? `Could not load contacts.\n${detail}`
          : 'Could not load contacts.',
      );
    } finally {
      setContactsLoading(false);
    }
  }, [contactsDirectory]);

  const toggleContact = useCallback((id: string) => {
    setSelectedContactIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    });
  }, []);

  const importSelectedContacts = useCallback(() => {
    const picked: Player[] = [];
    for (const row of withEmail) {
      if (!selectedContactIds.has(row.id)) {
        continue;
      }
      if (!row.email) {
        continue;
      }
      picked.push(
        createPlayer({
          name: row.name,
          email: row.email,
          phone: row.phone ?? '',
        }),
      );
    }
    setPlayers(prev => mergeUniqueByEmail(prev, picked));
    setContactsOpen(false);
    setSelectedContactIds(new Set());
  }, [selectedContactIds, withEmail]);

  const onConfirm = useCallback(() => {
    onConfirmNext?.(players);
  }, [onConfirmNext, players]);

  return (
    <View
      style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <AppBar
        variant="back"
        title="Import Squad"
        onLeftPress={onBack}
        trailingLabel="Step 2/3"
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <ProgressTracker
          stepLabel="Step 02"
          title="Import Squad"
          progress={2 / 3}
          description="Build your tactical foundation. Choose your preferred method to bring your athletes onto the pitch."
        />

        <View style={styles.bento}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            disabled
            style={[styles.csvCard, styles.cardDisabled]}>
            <LinearGradient
              colors={[
                theme.colors.grassGradientStart,
                theme.colors.grassGradientEnd,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.csvIconWrap}>
              <AppIcon name="upload-file" size={24} color="#ffffff" />
            </LinearGradient>
            <Text style={styles.csvTitle}>Import from CSV</Text>
            <Text style={styles.csvSubtitle}>Bulk Player Upload</Text>
            <Text style={styles.comingSoon}>Coming soon</Text>
          </Pressable>

          <View style={styles.bentoRow}>
            <Pressable
              accessibilityRole="button"
              testID="import-contacts-trigger"
              onPress={openContacts}
              style={styles.halfCard}>
              <View
                style={[
                  styles.smallIconWrap,
                  { backgroundColor: theme.colors.secondaryContainer },
                ]}>
                <AppIcon
                  name="sync"
                  size={22}
                  color={theme.colors.secondary}
                />
              </View>
              <Text style={styles.halfTitle}>Sync Contacts</Text>
              <Text style={styles.halfSubtitle}>Local Address Book</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              testID="import-manual-trigger"
              onPress={() => setManualOpen(true)}
              style={styles.halfCard}>
              <View
                style={[
                  styles.smallIconWrap,
                  { backgroundColor: theme.colors.tertiaryContainer },
                ]}>
                <AppIcon
                  name="person-add"
                  size={22}
                  color={theme.colors.onTertiaryContainer}
                />
              </View>
              <Text style={styles.halfTitle}>Add Manually</Text>
              <Text style={styles.halfSubtitle}>One-by-one Entry</Text>
            </Pressable>
          </View>
        </View>

        {players.length > 0 ? (
          <View style={styles.rosterSection}>
            <Text style={styles.rosterHeading}>
              Squad ({players.length}) — {team.name || 'Your team'}
            </Text>
            {players.map(p => (
              <SurfaceCard key={p.id} style={styles.playerRow}>
                <View style={styles.playerRowText}>
                  <Text style={styles.playerName}>{p.name}</Text>
                  <Text style={styles.playerMeta}>{p.email}</Text>
                  {p.phone ? (
                    <Text style={styles.playerMeta}>{p.phone}</Text>
                  ) : null}
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${p.name}`}
                  hitSlop={12}
                  onPress={() => removePlayer(p.id)}
                  style={styles.removeHit}>
                  <AppIcon name="close" size={22} color={theme.colors.error} />
                </Pressable>
              </SurfaceCard>
            ))}
          </View>
        ) : null}

        <View
          style={[
            styles.tipCard,
            { backgroundColor: theme.colors.tertiary },
          ]}>
          <View style={styles.tipHeader}>
            <View style={styles.tipIconBubble}>
              <AppIcon name="info" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.tipBadge}>Pro Tip</Text>
          </View>
          <Text style={styles.tipTitle}>
            CSV import will support bulk uploads in a future release.
          </Text>
        </View>

        <SurfaceCard style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Tactical Instructions</Text>
          <View style={styles.instructionRow}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Ensure all player emails are unique for individual profile
              tracking.
            </Text>
          </View>
          <View style={styles.instructionRow}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Positions and jersey numbers can be assigned after the initial
              import.
            </Text>
          </View>
        </SurfaceCard>
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
          testID="import-players-confirm"
          title="Confirm & Next"
          endIcon="arrow-forward"
          onPress={onConfirm}
        />
      </View>

      <Modal
        visible={manualOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setManualOpen(false)}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setManualOpen(false)}>
          <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Add player</Text>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              testID="manual-player-name"
              value={manualName}
              onChangeText={setManualName}
              placeholder="Full name"
              placeholderTextColor={`${theme.colors.outlineVariant}99`}
              style={[
                styles.input,
                { color: theme.colors.onSurface },
              ]}
            />
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              testID="manual-player-email"
              value={manualEmail}
              onChangeText={setManualEmail}
              placeholder="player@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={`${theme.colors.outlineVariant}99`}
              style={[
                styles.input,
                { color: theme.colors.onSurface },
              ]}
            />
            <Text style={styles.inputLabel}>Phone (optional)</Text>
            <TextInput
              testID="manual-player-phone"
              value={manualPhone}
              onChangeText={setManualPhone}
              placeholder="+1 …"
              keyboardType="phone-pad"
              placeholderTextColor={`${theme.colors.outlineVariant}99`}
              style={[
                styles.input,
                { color: theme.colors.onSurface },
              ]}
            />
            {manualError ? (
              <Text style={styles.errorText}>{manualError}</Text>
            ) : null}
            <PrimaryGradientButton
              testID="manual-player-submit"
              title="Add to squad"
              onPress={submitManual}
            />
            <Pressable
              onPress={() => setManualOpen(false)}
              style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={contactsOpen}
        animationType="slide"
        onRequestClose={() => setContactsOpen(false)}>
        <View
          style={[
            styles.contactsModalRoot,
            { paddingTop: insets.top, backgroundColor: theme.colors.surface },
          ]}>
          <View style={styles.contactsHeader}>
            <Pressable onPress={() => setContactsOpen(false)} hitSlop={12}>
              <Text style={styles.contactsClose}>Close</Text>
            </Pressable>
            <Text style={styles.contactsTitle}>Select contacts</Text>
            <Pressable
              testID="contacts-import-confirm"
              onPress={importSelectedContacts}
              disabled={selectedContactIds.size === 0}
              hitSlop={12}>
              <Text
                style={[
                  styles.contactsImport,
                  selectedContactIds.size === 0 && styles.contactsImportDisabled,
                ]}>
                Import ({selectedContactIds.size})
              </Text>
            </Pressable>
          </View>
          <Text style={styles.contactsHint}>
            Only contacts with an email can be added. Duplicates are skipped.
          </Text>
          {contactsLoading ? (
            <Text style={styles.loadingText}>Loading…</Text>
          ) : (
            <FlatList
              data={withEmail}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const on = selectedContactIds.has(item.id);
                return (
                  <Pressable
                    testID={`contact-row-${item.id}`}
                    onPress={() => toggleContact(item.id)}
                    style={[
                      styles.contactRow,
                      on && styles.contactRowSelected,
                    ]}>
                    <AppIcon
                      name={on ? 'check-box' : 'check-box-outline-blank'}
                      size={24}
                      color={
                        on ? theme.colors.primary : theme.colors.outlineVariant
                      }
                    />
                    <View style={styles.contactText}>
                      <Text style={styles.contactName}>{item.name}</Text>
                      <Text style={styles.contactEmail}>{item.email}</Text>
                    </View>
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.emptyContacts}>
                  No contacts with email addresses found.
                </Text>
              }
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[2],
    gap: theme.spacing[6],
  },
  bento: {
    gap: theme.spacing[4],
  },
  csvCard: {
    borderRadius: theme.radii.xl,
    padding: theme.spacing[6],
    backgroundColor: theme.colors.surfaceContainerLowest,
    ...theme.ambientShadow,
  },
  cardDisabled: {
    opacity: 0.72,
  },
  csvIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
  },
  csvTitle: {
    ...theme.typography.headline,
    fontSize: theme.typography.titleLg,
    color: theme.colors.onSurface,
  },
  csvSubtitle: {
    ...theme.typography.label,
    fontSize: theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: theme.spacing[1],
  },
  comingSoon: {
    ...theme.typography.label,
    fontSize: 11,
    color: theme.colors.primary,
    marginTop: theme.spacing[3],
    textTransform: 'uppercase',
  },
  bentoRow: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  halfCard: {
    flex: 1,
    minWidth: 0,
    borderRadius: theme.radii.xl,
    padding: theme.spacing[5],
    backgroundColor: theme.colors.surfaceContainerLowest,
    ...theme.ambientShadow,
  },
  smallIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[3],
  },
  halfTitle: {
    ...theme.typography.headline,
    fontSize: theme.typography.bodyLg,
    color: theme.colors.onSurface,
  },
  halfSubtitle: {
    ...theme.typography.label,
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginTop: theme.spacing[1],
    letterSpacing: 0.8,
  },
  rosterSection: {
    gap: theme.spacing[3],
  },
  rosterHeading: {
    ...theme.typography.label,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
  },
  playerRowText: {
    flex: 1,
    gap: theme.spacing[1],
  },
  playerName: {
    ...theme.typography.headline,
    fontSize: theme.typography.bodyLg,
    color: theme.colors.onSurface,
  },
  playerMeta: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  removeHit: {
    padding: theme.spacing[2],
  },
  tipCard: {
    borderRadius: theme.radii.xl,
    padding: theme.spacing[6],
    minHeight: 120,
    justifyContent: 'space-between',
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tipIconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipBadge: {
    ...theme.typography.label,
    fontSize: 10,
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radii.pill,
    overflow: 'hidden',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  tipTitle: {
    ...theme.typography.headline,
    fontSize: theme.typography.titleLg,
    color: '#ffffff',
    marginTop: theme.spacing[4],
  },
  instructions: {
    gap: theme.spacing[4],
  },
  instructionsTitle: {
    ...theme.typography.headline,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  instructionRow: {
    flexDirection: 'row',
    gap: theme.spacing[4],
    alignItems: 'flex-start',
  },
  bullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletText: {
    fontSize: 10,
    fontWeight: '900',
    color: theme.colors.onPrimaryContainer,
  },
  instructionText: {
    ...theme.typography.body,
    flex: 1,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
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
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderTopLeftRadius: theme.radii.xxl,
    borderTopRightRadius: theme.radii.xxl,
    padding: theme.spacing[6],
    gap: theme.spacing[2],
    ...theme.ambientShadow,
  },
  modalTitle: {
    ...theme.typography.title,
    fontSize: theme.typography.titleLg,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing[2],
  },
  inputLabel: {
    ...theme.typography.label,
    fontSize: theme.typography.labelSm,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: theme.spacing[2],
  },
  input: {
    ...theme.typography.body,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    marginTop: theme.spacing[1],
  },
  errorText: {
    ...theme.typography.label,
    color: theme.colors.error,
    marginTop: theme.spacing[2],
  },
  modalCancel: {
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
  },
  modalCancelText: {
    ...theme.typography.body,
    color: theme.colors.primary,
  },
  contactsModalRoot: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },
  contactsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[3],
  },
  contactsClose: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontSize: 16,
  },
  contactsTitle: {
    ...theme.typography.headline,
    fontSize: theme.typography.bodyLg,
    color: theme.colors.onSurface,
  },
  contactsImport: {
    ...theme.typography.headline,
    fontSize: 16,
    color: theme.colors.primary,
  },
  contactsImportDisabled: {
    opacity: 0.4,
  },
  contactsHint: {
    ...theme.typography.body,
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing[3],
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: theme.spacing[8],
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.outlineVariant,
  },
  contactRowSelected: {
    backgroundColor: `${theme.colors.primary}12`,
  },
  contactText: {
    flex: 1,
  },
  contactName: {
    ...theme.typography.headline,
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  contactEmail: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  emptyContacts: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: theme.spacing[8],
  },
}));

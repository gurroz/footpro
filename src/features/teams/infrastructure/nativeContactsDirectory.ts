import {
  InteractionManager,
  NativeModules,
  PermissionsAndroid,
  Platform,
  TurboModuleRegistry,
} from 'react-native';
import type { Contact } from 'react-native-contacts';

import type { ContactRow, ContactsDirectoryPort } from '../ports/ContactsDirectoryPort';

/** RCTContacts native API — do not use `react-native-contacts` default export for calls (see resolve). */
type ContactsNativeApi = {
  getAllWithoutPhotos: () => Promise<unknown>;
  getAll: () => Promise<unknown>;
  requestPermission?: () => Promise<
    'authorized' | 'denied' | 'undefined' | 'limited'
  >;
};

function contactName(c: Contact): string {
  const parts = [c.givenName, c.familyName].filter(Boolean).join(' ').trim();
  if (parts.length > 0) {
    return parts;
  }
  if (c.displayName?.trim()) {
    return c.displayName.trim();
  }
  return 'Unknown';
}

function firstEmail(c: Contact): string | null {
  const addrs = c.emailAddresses;
  if (!Array.isArray(addrs) || addrs.length === 0) {
    return null;
  }
  const raw = addrs[0]?.email;
  if (typeof raw !== 'string') {
    return null;
  }
  const t = raw.trim();
  return t.length > 0 ? t : null;
}

function firstPhone(c: Contact): string | null {
  const nums = c.phoneNumbers;
  if (!Array.isArray(nums) || nums.length === 0) {
    return null;
  }
  const raw = nums[0]?.number;
  if (typeof raw !== 'string') {
    return null;
  }
  const t = raw.trim();
  return t.length > 0 ? t : null;
}

/**
 * `react-native-contacts` binds `const Contacts = NativeModules.Contacts ?? TurboModuleRegistry.get('RCTContacts')`
 * once at import time. If both are null then, every method throws
 * "Cannot read property 'getAllWithoutPhotos' of null".
 *
 * Resolve RCTContacts at call time via the same registry the runtime uses.
 */
const NATIVE_MODULE_CANDIDATES = ['RCTContacts', 'RNContactsSpec'] as const;

function resolveRctContactsModule(): ContactsNativeApi | null {
  for (const name of NATIVE_MODULE_CANDIDATES) {
    const mod = TurboModuleRegistry.get(name) as ContactsNativeApi | null;
    if (mod != null && typeof mod.getAllWithoutPhotos === 'function') {
      return mod;
    }
  }

  const nm = NativeModules as Record<string, ContactsNativeApi | undefined>;
  const legacy = nm.RCTContacts ?? nm.Contacts;
  if (legacy != null && typeof legacy.getAllWithoutPhotos === 'function') {
    return legacy;
  }

  return null;
}

function getContactsApi(): ContactsNativeApi {
  const mod = resolveRctContactsModule();
  if (mod == null) {
    throw new Error(
      'Native contacts module (RCTContacts) is not registered. The Android app must include react-native-contacts in PackageList — run: cd android && ./gradlew clean && cd .. && npx react-native run-android. If it persists, add ReactNativeContacts to MainApplication (see react-native-contacts docs).',
    );
  }
  return mod;
}

function normalizeContactList(raw: unknown): Contact[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw as Contact[];
}

function toRows(contacts: Contact[]): ContactRow[] {
  const rows: ContactRow[] = [];
  for (let i = 0; i < contacts.length; i++) {
    try {
      const c = contacts[i];
      const rid = c.recordID;
      const id =
        rid != null && String(rid).length > 0 ? String(rid) : `contact_${i}`;
      rows.push({
        id,
        name: contactName(c),
        email: firstEmail(c),
        phone: firstPhone(c),
      });
    } catch {
      // Skip malformed rows (bad OEM contact data).
    }
  }
  return rows;
}

async function requestAndroidReadContactsPermission(): Promise<boolean> {
  const permission = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
  try {
    const alreadyGranted = await PermissionsAndroid.check(permission);
    if (alreadyGranted) {
      return true;
    }
    const result = await PermissionsAndroid.request(permission, {
      title: 'Contacts',
      message:
        'FootPro needs access to your contacts to import players into your squad.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    });
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

async function requestIosContactsPermission(api: ContactsNativeApi): Promise<boolean> {
  const req = api.requestPermission;
  if (typeof req !== 'function') {
    return false;
  }
  try {
    const status = await req();
    return status === 'authorized' || status === 'limited';
  } catch {
    return false;
  }
}

export function createNativeContactsDirectory(): ContactsDirectoryPort {
  return {
    async requestPermission(): Promise<boolean> {
      if (Platform.OS === 'android') {
        return requestAndroidReadContactsPermission();
      }
      return requestIosContactsPermission(getContactsApi());
    },
    async listContacts(): Promise<ContactRow[]> {
      const api = getContactsApi();

      if (Platform.OS === 'android') {
        await new Promise<void>(resolve => {
          InteractionManager.runAfterInteractions(() => resolve());
        });
      }

      let rawList: unknown;
      try {
        rawList = await api.getAllWithoutPhotos();
      } catch (firstErr) {
        try {
          rawList = await api.getAll();
        } catch {
          throw firstErr;
        }
      }

      return toRows(normalizeContactList(rawList));
    },
  };
}

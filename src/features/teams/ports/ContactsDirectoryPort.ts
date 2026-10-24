export type ContactRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

export type ContactsDirectoryPort = {
  requestPermission(): Promise<boolean>;
  listContacts(): Promise<ContactRow[]>;
};

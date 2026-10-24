export type PickedImage = {
  uri: string;
  /** Byte size when provided by the native picker. */
  fileSize?: number;
};

export type ImageLibraryPort = {
  pickImage(): Promise<PickedImage | null>;
};

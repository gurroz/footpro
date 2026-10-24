import { TurboModuleRegistry } from 'react-native';
import type {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';

import type { ImageLibraryPort, PickedImage } from '../ports/ImageLibraryPort';

type ImagePickerNative = {
  launchImageLibrary(
    options: ImageLibraryOptions & CameraOptions,
    callback: (result: ImagePickerResponse) => void,
  ): void;
};

/**
 * Resolves the native module at call time. The library's own
 * `launchImageLibrary` binds `TurboModuleRegistry.get('ImagePicker')` once at
 * import time; that snapshot can stay null on Android if evaluated too early.
 */
function getImagePickerNative(): ImagePickerNative | null {
  // Resolve at call time (not at module load) so we never keep a stale null from
  // react-native-image-picker's eager TurboModuleRegistry snapshot.
  return TurboModuleRegistry.get('ImagePicker') as ImagePickerNative | null;
}

/**
 * Must match react-native-image-picker's DEFAULT_OPTIONS merge — Android
 * `Options.java` assumes keys like `restrictMimeTypes` exist (getArray().toArrayList() NPE if absent).
 */
const libraryOptionsBase: ImageLibraryOptions & CameraOptions = {
  mediaType: 'photo',
  restrictMimeTypes: [],
  videoQuality: 'high',
  quality: 1,
  maxWidth: 0,
  maxHeight: 0,
  includeBase64: false,
  cameraType: 'back',
  selectionLimit: 1,
  saveToPhotos: false,
  durationLimit: 0,
  includeExtra: false,
  presentationStyle: 'pageSheet',
  assetRepresentationMode: 'auto',
};

export function createNativeImageLibrary(): ImageLibraryPort {
  return {
    async pickImage(): Promise<PickedImage | null> {
      const native = getImagePickerNative();
      if (native == null) {
        return null;
      }

      return new Promise(resolve => {
        try {
          native.launchImageLibrary(libraryOptionsBase, (result: ImagePickerResponse) => {
            if (result.didCancel || result.errorCode != null) {
              resolve(null);
              return;
            }
            const asset = result.assets?.[0];
            if (asset?.uri == null) {
              resolve(null);
              return;
            }
            resolve({
              uri: asset.uri,
              fileSize: asset.fileSize,
            });
          });
        } catch {
          resolve(null);
        }
      });
    },
  };
}

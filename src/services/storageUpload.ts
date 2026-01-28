import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export async function uploadFileToStorage(options: {
  file: File;
  path: string;
}): Promise<string> {
  const storageRef = ref(storage, options.path);
  await uploadBytes(storageRef, options.file);
  return await getDownloadURL(storageRef);
}


import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export async function uploadFileToStorage(options: {
  file: File;
  path: string;
}): Promise<string> {
  const requestId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const fileSummary = {
    fileName: options.file.name,
    fileSize: options.file.size,
    fileType: options.file.type,
    path: options.path,
  };

  console.log(`[TRACE] feature=storage step=validate_file requestId=${requestId}`, fileSummary);

  try {
    console.log(`[TRACE] feature=storage step=upload_start requestId=${requestId}`, fileSummary);

    const storageRef = ref(storage, options.path);
    await uploadBytes(storageRef, options.file);

    console.log(`[TRACE] feature=storage step=upload_done requestId=${requestId}`, {
      path: options.path,
    });

    const downloadURL = await getDownloadURL(storageRef);

    console.log(`[TRACE] feature=storage step=upload_complete requestId=${requestId}`, {
      urlLength: downloadURL.length,
      urlPreview: downloadURL.substring(0, 50) + '...',
    });

    return downloadURL;
  } catch (error: any) {
    console.error(`[TRACE] feature=storage step=upload_error requestId=${requestId}`, {
      error: error.message,
      code: error.code,
    });
    throw error;
  }
}


import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload file (photo or video) to Firebase Storage
 */
export const uploadFile = async (file, userId, conversationId) => {
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `conversations/${conversationId}/${userId}/${fileName}`;
  
  const storageRef = ref(storage, filePath);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return {
    url: downloadURL,
    path: filePath,
    name: file.name,
    size: file.size,
    type: file.type
  };
};

/**
 * Validate file type and size
 */
export const validateFile = (file) => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
  
  if (file.size > maxSize) {
    throw new Error('File size exceeds 50MB limit');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type not supported. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, MOV) are allowed');
  }
  
  return true;
};

/**
 * Determine if file is an image
 */
export const isImage = (fileType) => {
  return fileType.startsWith('image/');
};

/**
 * Determine if file is a video
 */
export const isVideo = (fileType) => {
  return fileType.startsWith('video/');
};

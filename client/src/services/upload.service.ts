import Axios from '@/config/api.config';
import { ICommonResponseDTO } from '@/dto/common.dto';
import axios from 'axios';

export interface IPresignedUrlResponse {
  key: string;
  presignedUrl: string;
}

export interface IPublicUploadResponse extends IPresignedUrlResponse {
  publicUrl: string;
}

// Plain axios instance for S3 — bypasses your interceptors entirely
const S3Axios = axios.create();

export const getSecureUploadUrl = async (
  fileType: string,
  folder: string,
  keyCount = 1,
  oldKeys?: string[],
): Promise<IPresignedUrlResponse[]> => {
  const response = await Axios.post<ICommonResponseDTO<IPresignedUrlResponse[]>>(
    '/v1/s3/protected-upload',
    { fileType, folder, keyCount, oldKeys },
  );
  return response.data.data;
};

export const getPublicUploadUrl = async (
  fileType: string,
  folder: string,
  keyCount = 1,
  oldKeys?: string[],
): Promise<IPublicUploadResponse[]> => {
  const response = await Axios.post<ICommonResponseDTO<IPublicUploadResponse[]>>(
    '/v1/s3/public-upload',
    { fileType, folder, keyCount, oldKeys },
  );
  return response.data.data;
};

// Uses S3Axios — no auth headers, no interceptors, direct S3 call
const uploadToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  const response = await S3Axios.put(presignedUrl, file, {
    headers: { 'Content-Type': file.type },
  });
  if (response.status !== 200) {
    throw new Error(`Upload failed: ${response.status}`);
  }
};

export const uploadSecureFile = async (
  file: File,
  folder: string,
  oldKey?: string,
): Promise<{ key: string }> => {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large. Maximum size is 10MB.');
  }
  const uploads = await getSecureUploadUrl(file.type, folder, 1, oldKey ? [oldKey] : undefined);
  await uploadToS3(uploads[0].presignedUrl, file);
  return { key: uploads[0].key };
};

export const uploadPublicImage = async (
  file: File,
  folder: string,
  oldKey?: string,
): Promise<{ key: string; url: string }> => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images allowed.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image too large. Maximum size is 5MB.');
  }
  const uploads = await getPublicUploadUrl(file.type, folder, 1, oldKey ? [oldKey] : undefined);
  await uploadToS3(uploads[0].presignedUrl, file);
  return { key: uploads[0].key, url: uploads[0].publicUrl };
};

export const uploadMultiplePublicImages = async (
  files: File[],
  folder: string,
): Promise<{ uploads: { key: string; url: string }[] }> => {
  const uploads = await getPublicUploadUrl(files[0].type, folder, files.length);
  await Promise.all(files.map((file, index) => uploadToS3(uploads[index].presignedUrl, file)));
  return {
    uploads: uploads.map((upload) => ({ key: upload.key, url: upload.publicUrl })),
  };
};

export const deleteS3Files = async (keys: string[]): Promise<void> => {
  await Axios.delete('/v1/s3/files', { data: { keys } });
};

export const getFileUrl = async (key: string, isSecure = false): Promise<string | undefined> => {
  const response = await Axios.get(`/v1/s3/file-url/${key}?secure=${isSecure}`);
  return response.data.data?.url;
};

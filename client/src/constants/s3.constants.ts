/**
 * S3 folder structure for different upload types
 *
 * SECURE FOLDERS (via /v1/s3/protected-upload):
 * - Documents, reports, sensitive files
 * - Requires authentication to access
 *
 * PUBLIC FOLDERS (via /v1/s3/public-upload):
 * - Images, profile pictures, social content
 * - Publicly accessible immediately
 */
export const S3_FOLDERS = {
  // Secure folders
  DOCUMENTS: 'documents',
  REPORTS: 'reports',
  ACADEMIC_RECORDS: 'academic-records',

  // Public folders
  PROFILE_IMAGES: 'profile-images',
  EVENT_IMAGES: 'events',
  SOCIAL_MEDIA: 'social-media',
  ANNOUNCEMENTS: 'announcements',
  GALLERY: 'gallery',
} as const;

/**
 * Upload service guide for developers
 */
export const UPLOAD_GUIDE = {
  // Use uploadSecureFile() for:
  SECURE_FILES: ['Documents', 'Reports', 'Academic records', 'Private data'],

  // Use uploadPublicImage() for:
  PUBLIC_FILES: ['Profile pictures', 'Event photos', 'Announcements', 'Gallery images'],
} as const;

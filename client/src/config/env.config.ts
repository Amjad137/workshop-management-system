import { ENVIRONMENTS } from '@/constants/common.constants';
import { VERSION } from '../version';

export const environment = {
  isDebugMode: process.env.NODE_ENV === ENVIRONMENTS.DEV,
  env: process.env.NODE_ENV as ENVIRONMENTS,
  packageName: process.env.NEXT_PUBLIC_PACKAGE_NAME as string,
  packageVersion: VERSION,
  siteURL: process.env.NEXT_PUBLIC_SITE_URL as string,
  apiURL: process.env.NEXT_PUBLIC_API_URL as string,
  authStoreKey: process.env.NEXT_PUBLIC_AUTH_STORE_KEY as string,

  s3BucketName: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
  awsRegion: process.env.NEXT_PUBLIC_AWS_REGION as string,
};

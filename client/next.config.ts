import type { NextConfig } from 'next';

const s3BucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
const awsRegion = process.env.NEXT_PUBLIC_AWS_REGION;

if (!s3BucketName || !awsRegion) {
  throw new Error('Missing S3 environment variables');
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${s3BucketName}.s3.${awsRegion}.amazonaws.com`,
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/providers/auth.provider';
import ReactQueryProvider from '@/providers/react-query.provider';
import { poppins } from '@/utils/font-utils';
import '@/utils/yup-extension-utils'; // Register custom yup methods globally
import { Metadata } from 'next';
import { ReactNode } from 'react';

import NextTopLoader from 'nextjs-toploader';
import '../styles/global.css';

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: { default: 'Biztock', template: '%s | Biztock Template' },
  description: "Let's Turn the Ideas into Reality with Technology",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body className={poppins.variable} suppressHydrationWarning={true}>
        <ReactQueryProvider>
          <AuthProvider>
            <NextTopLoader />
            <main>
              <div>{children}</div>
            </main>
            <Toaster />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

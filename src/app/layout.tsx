import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import SiteHeader from '@/components/global/SiteHeader';
import Provider from '@/components/providers/Provider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Mixup.gg',
  description: 'Mixup.gg'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <SiteHeader />
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}

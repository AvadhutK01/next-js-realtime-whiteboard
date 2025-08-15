
'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    fetch('/api/socket');
  }, []);
  return (
    <html lang="en">
      <SessionProvider>
      <body className={inter.className}>
        {children}
      </body>
      </SessionProvider>
    </html>
  );
}

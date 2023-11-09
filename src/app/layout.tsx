import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import './globals.css';
import 'material-icons/iconfont/material-icons.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'bSJ IFC Viewer',
  description: 'A simple IFC viewer to view IFC files in the browser',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

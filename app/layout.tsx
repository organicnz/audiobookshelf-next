import React from 'react';
import './globals.css';
import { PlayerProvider } from '../context/PlayerContext';
import { Layout } from '../components/Layout';

export const metadata = {
  title: 'Audiobookshelf Next',
  description: 'A modern, serverless rewrite of Audiobookshelf.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PlayerProvider>
          <Layout>
            {children}
          </Layout>
        </PlayerProvider>
      </body>
    </html>
  );
}
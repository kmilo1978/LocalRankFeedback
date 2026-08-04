import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LocalRank Feedback',
  description: 'Plataforma de reputacion, retencion y referidos para negocios locales',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

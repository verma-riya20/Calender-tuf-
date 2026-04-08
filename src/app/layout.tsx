import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wall Calendar — Interactive Date Range Planner',
  description:
    'A polished, physical wall-calendar-inspired component with date range selection, persistent notes, and beautiful monthly hero imagery.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

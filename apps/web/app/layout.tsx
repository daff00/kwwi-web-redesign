import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'KWWI',
    template: '%s | KWWI',
  },
  description: 'Welcome to KWWI',
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ]
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <>{children}</>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
import './globals.css';
import type { Metadata } from 'next';
import { Inter, Bodoni_Moda } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bodoni',
});

export const metadata: Metadata = {
  title: 'Dnyanit Bhusari',
  description: 'Full-Stack Developer Portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} ${bodoni.variable}`}>
      <body className="bg-ink text-parchment antialiased">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 bg-cover bg-top opacity-[30] mix-blend-overlay bg-[url('/hhholographic.png')]"
        />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
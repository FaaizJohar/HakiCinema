import type { Metadata } from 'next';
import { Manrope, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';

const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'), // Replace with actual production URL when deploying
  title: {
    default: 'HAKIBOX | Premium Anime Streaming Platform',
    template: '%s | HAKIBOX'
  },
  description: 'Watch your favorite anime in premium 4K/1080p quality. Ad-free streaming, tracking, and the latest simulcasts on HAKIBOX.',
  keywords: ['anime', 'streaming', 'watch anime', 'hakibox', 'premium anime', 'simulcast', 'hd anime', 'anime online'],
  authors: [{ name: 'HAKIBOX Team' }],
  creator: 'HAKIBOX',
  publisher: 'HAKIBOX Entertainment',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'HAKIBOX | Premium Anime Streaming',
    description: 'The ultimate anime streaming experience. Watch in 4K/1080p, track your progress, and discover new favorites.',
    url: '/',
    siteName: 'HAKIBOX',
    images: [
      {
        url: '/og-image.jpg', // Placeholder, create this later or use external
        width: 1200,
        height: 630,
        alt: 'HAKIBOX Premium Anime Streaming',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HAKIBOX | Premium Anime Streaming',
    description: 'The ultimate anime streaming experience. Watch in 4K/1080p, track your progress, and discover new favorites.',
    images: ['/twitter-image.jpg'], // Placeholder
    creator: '@hakibox',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.variable} ${plusJakarta.variable} font-sans bg-background text-foreground relative antialiased selection:bg-crimson/30 selection:text-white`}>
        <AuthModal />
        <Navbar />
        
        {/* Main Content Wrapper - Needs solid background to cover the footer */}
        <main className="relative z-10 bg-background min-h-screen shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-[400px]">
          {children}
        </main>
        
        {/* Fixed Footer that gets revealed as you scroll past main */}
        <div className="fixed bottom-0 left-0 w-full z-0 h-[400px]">
           <Footer />
        </div>
      </body>
    </html>
  );
}

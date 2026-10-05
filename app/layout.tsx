import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth/authContext';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/common/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  themeColor: '#0B132B',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://estatevista.com'),
  title: {
    default: 'EstateVista | Luxury Real Estate & Signature Residences',
    template: '%s | EstateVista',
  },
  description:
    'Discover premier architect-designed luxury villas, lakefront penthouses, and verified residential estates across Hyderabad, Bangalore, Mumbai, Pune, and Chennai.',
  keywords: [
    'luxury real estate',
    'villas in hyderabad',
    'gachibowli luxury apartments',
    'bangalore penthouses',
    'mumbai sea facing residences',
    'estatevista',
  ],
  authors: [{ name: 'EstateVista Real Estate' }],
  openGraph: {
    title: 'EstateVista | Luxury Real Estate & Signature Residences',
    description:
      'Discover premier architect-designed luxury villas, lakefront penthouses, and verified residential estates.',
    url: 'https://estatevista.com',
    siteName: 'EstateVista',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'EstateVista Luxury Residence',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col justify-between bg-[#f8fafc] text-slate-900 selection:bg-[#c59b27] selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

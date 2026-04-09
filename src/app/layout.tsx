import QueryProvider from '@/components/QueryProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AIChatbot from '@/components/AIChatbot';
import { LayoutContent } from '@/components/LayoutContent';
import { ThemeProvider } from '@/components/ThemeProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0f1d',
};

export const metadata: Metadata = {
  title: {
    template: '%s | PropShare Protocol',
    default: 'PropShare | Institutional Grade Real Estate Exchange',
  },
  description:
    'The premier platform for fractional, high-yield commercial real estate investment via digital registry.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning={true}
      className={`${inter.variable} ${outfit.variable} scroll-smooth`}
      data-scroll-behavior='smooth'
    >
      <head>
        <link rel='icon' href='/logo.svg' />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.className} font-sans bg-background text-white selection:bg-white/5 selection:text-white antialiased`}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <LayoutContent>{children}</LayoutContent>
            </ThemeProvider>
            <Toaster
              position='bottom-right'
              toastOptions={{
                style: {
                  background: '#151c2e',
                  color: '#fff',
                  borderRadius: '24px',
                  padding: '16px 28px',
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(20px)',
                },
                success: {
                  iconTheme: {
                    primary: '#2563eb',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <AIChatbot />
          </AuthProvider>
        </QueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: '--font-outfit',
});

export const metadata: Metadata = {
    title: {
        template: '%s | PropShare Protocol',
        default: 'PropShare | Institutional Grade Real Estate Exchange',
    },
    description: "The premier platform for fractional, high-yield commercial real estate investment via digital registry.",
    viewport: "width=device-width, initial-scale=1",
    themeColor: "#0a0f1d",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className={`${inter.className} font-sans bg-[#0a0f1d] text-white selection:bg-blue-600/30 selection:text-white antialiased`}>
                <AuthProvider>
                    <Navbar />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <Footer />
                    <Toaster
                        position="bottom-right"
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
                </AuthProvider>
            </body>
        </html>
    );
}

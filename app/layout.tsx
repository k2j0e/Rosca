import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Circle8 - Save Together",
  description: "Join a savings circle with people you trust. Zero interest, zero fees. Community-powered finance.",
  metadataBase: new URL('https://circle8.ca'),
  openGraph: {
    title: "Circle8 - Save Together",
    description: "Join a savings circle with people you trust. Zero interest, zero fees. Community-powered finance.",
    url: "https://circle8.ca",
    siteName: "Circle8",
    images: [
      {
        url: "/og-image.png",
        width: 1024,
        height: 1024,
        alt: "Circle8 - Community Savings Circles",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Circle8 - Save Together",
    description: "Join a savings circle with people you trust. Zero interest, zero fees.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/og-image.png",
    apple: "/og-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} antialiased`}>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#F8F9FC" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0F172A" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark selection:bg-primary selection:text-white pb-0 font-sans">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Circle8 - Save Together",
  description: "Join a circle and start saving together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${workSans.variable}`}>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f8f6f6" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#221610" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-display bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark pb-0">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}


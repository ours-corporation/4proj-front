import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SocketProviderWrapper from "./SocketProviderWrapper";
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SupFile",
  description: "Stockez, sécurisez et partagez vos fichiers dans le cloud",
  icons: {
    icon: [
      { url: "/logo-light.svg", media: "(prefers-color-scheme: light)" },
      { url: "/logo-dark.svg", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader color="#7c6ef8" shadow="0 0 10px #7c6ef8,0 0 5px #42aff0" showSpinner={false} />
        <SocketProviderWrapper>{children}</SocketProviderWrapper>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import LinkFocus from "./components/link-focus";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col items-center justify-center text-center w-full">
          <header className="w-full px-8 py-4 border-b border-cyber-gray bg-cyber-blue">
            <div className="max-w-7xl mx-auto flex items-center gap-x-4">
              <Image src="/logo.svg" alt="Cyber-Log" width={120} height={40} />
              <nav className="flex gap-x-4 text-xl ">
                <LinkFocus href="/">Home</LinkFocus>
                <LinkFocus href="/logs">
                  Logs
                </LinkFocus>
              </nav>
            </div>
          </header>
          {children}
          <footer className="w-full mt-auto py-4 bg-cyber-blue border-t border-cyber-gray">
            <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Cyber-Log. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

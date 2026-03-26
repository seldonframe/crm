import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DemoToastProvider } from "@/components/shared/demo-toast-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seldon Frame",
  description: "Open source CRM framework scaffold",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <DemoToastProvider>{children}</DemoToastProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { AppToaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Audio Transcriber Admin",
  description: "Production-ready admin dashboard for Gemini-powered audio transcription.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-950 flex flex-col">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}

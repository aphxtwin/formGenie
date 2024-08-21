import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils";
import {Toaster, toast} from 'sonner'; 
const fontSans = FontSans({
subsets: ["latin"],
variable: "--font-sans",
})



export const metadata: Metadata = {
  title: "FormGenie",
  description: "Gain insights from data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased bg-white selection:bg-gray-300",
          fontSans.variable
        )}
      >
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}


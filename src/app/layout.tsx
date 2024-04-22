import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils"
const fontSans = FontSans({
subsets: ["latin"],
variable: "--font-sans",
})



export const metadata: Metadata = {
  title: "Form Genie",
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
          "min-h-screen bg-background font-sans antialiased bg-[#F2F3F4] selection:bg-gray-300",
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}

export const runtime = "edge";
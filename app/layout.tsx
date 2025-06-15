
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"; // You'll need to create this or use a library
import { Toaster } from "@/components/ui/toaster"; // Assuming you add toaster from shadcn/ui

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Imagee Floppa - Your Awesome Image Host",
  description: "Upload images and get direct links instantly!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

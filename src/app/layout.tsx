import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BottomNav } from "@/components/BottomNav";
import { Toaster } from "@/components/ui/sonner";
import AuthGuard from "@/components/auth-guard";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Julia Financial | Dashboard",
  description: "Seu gerenciamento financeiro pessoal",
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${inter.variable} antialiased min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-green-100 selection:text-green-900`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthGuard>
            <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
              <Sidebar />
              {/* Main Workspace */}
              <div className="flex-grow flex flex-col min-h-screen max-w-screen-2xl mx-auto relative bg-background border-x border-accent/5 shadow-2xl overflow-x-hidden pt-safe w-full">
                <main className="flex-grow w-full max-w-full overflow-x-hidden relative">
                  {children}
                </main>
                {/* Mobile Spacing for BottomNav */}
                <div className="h-24 md:hidden"></div> 
                <BottomNav />
              </div>
            </div>
            <Toaster position="top-center" richColors theme="light" closeButton />
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}

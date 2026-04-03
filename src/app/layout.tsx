import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BottomNav } from "@/components/BottomNav";
import { Toaster } from "@/components/ui/sonner";
import AuthGuard from "@/components/auth-guard";
import { Sidebar } from "@/components/Sidebar";

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-heading",
  weight: ['400', '500', '600', '700', '800', '900']
});

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ['400', '500', '600', '700', '800']
});

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
      <body 
        className={`${outfit.variable} ${jakarta.variable} antialiased selection:bg-green-600/20 selection:text-green-800 dark:selection:text-green-200 overflow-x-hidden`}
        suppressHydrationWarning
      >
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

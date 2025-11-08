import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider";
import SplashScreen from "@/components/splashScreen";
import Script from "next/script";
import { NextIntlClientProvider, useLocale } from 'next-intl';
import AmplifyProvider from "@/components/amplifyProvider";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Numu",
  icons: {
    icon: "/favicon.ico",
  },
  description: "Smart greenhouse monitoring system",
};

export default function RootLayout({ children }) {

  const locale = useLocale();

  return (
    <html lang={locale} dir={locale === "ar" ? "ltr" : "ltr"} suppressHydrationWarning>
      <head>
        {/* Prevent theme flash before hydration */}
        <Script id="theme-initializer" strategy="beforeInteractive">
          {`
            try {
              const theme = localStorage.getItem('theme');
              const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const isDark = theme === 'dark' || (theme === 'system' && systemDark);
              if (isDark) document.documentElement.classList.add('dark');
              else document.documentElement.classList.remove('dark');
            } catch (e) {}
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale}>
          <AuthProvider>
            <AmplifyProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <SplashScreen />
                {children}
              </ThemeProvider>
            </AmplifyProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


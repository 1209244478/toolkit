import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/app/lib/i18n";
import { HomeStateProvider } from "@/app/lib/home-state";

export const metadata: Metadata = {
  title: "TOOLKIT — Online Toolkit",
  description: "A collection of tools for developers and creators. All tools run locally in your browser. Safe, fast, and free.",
  other: {
    "google-adsense-account": "ca-pub-8033518221937083",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <I18nProvider>
          <HomeStateProvider>
            {children}
          </HomeStateProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

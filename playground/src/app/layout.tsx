import type { Metadata } from "next";

import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { ThemeScript } from "@/components/theme-script";

export const metadata: Metadata = {
  title: "Conscia Design System",
  description: "Executable visual reference for the Conscia Enterprise Design System"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-appearance="system" data-density="comfortable" suppressHydrationWarning>
      <body>
        <ThemeScript />
        <div className="ds-app-root">
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}

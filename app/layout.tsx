import type { Metadata } from "next";
import { Schibsted_Grotesk, Source_Sans_3 } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const heading = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-schibsted",
});
const sans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  title: "Eon",
  description: "Your month at a glance, read from your banks.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${sans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

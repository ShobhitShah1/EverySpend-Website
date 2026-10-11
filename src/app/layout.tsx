import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {
  assetUrl,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

const bodyFont = localFont({
  src: "../../public/fonts/AlbertSans.ttf",
  display: "swap",
  weight: "100 900",
  variable: "--font-body",
});

const displayFont = localFont({ src: "../../public/fonts/Gelasio-Regular.ttf", display: "swap", variable: "--font-editorial" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: assetUrl("/manifest.webmanifest"),
  icons: {
    icon: [
      { url: assetUrl("/icons/favicon-16.png"), sizes: "16x16", type: "image/png" },
      { url: assetUrl("/icons/favicon-32.png"), sizes: "32x32", type: "image/png" },
      { url: assetUrl("/icons/favicon-48.png"), sizes: "48x48", type: "image/png" },
      { url: assetUrl("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
    ],
    shortcut: assetUrl("/icons/favicon-32.png"),
    apple: [
      {
        url: assetUrl("/icons/apple-touch-icon.png"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  keywords: [
    "EverySpend",
    "expense tracker",
    "Android expense tracking",
    "manual expense entry",
    "optional SMS import",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "EverySpend app preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#fafaf9",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem('everyspend-theme');document.documentElement.dataset.theme=t==='dark'||t==='light'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}})()" }} /></head>
      <body className={bodyFont.variable + " " + displayFont.variable}>
        {children}
      </body>
    </html>
  );
}

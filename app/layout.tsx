import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deep Learning Visualized",
  description:
    "Learn deep learning visually: interactive lessons, formulas and essays, from single neurons to transformers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply the saved site theme before first paint. Light stays the default. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('dlv-theme')==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

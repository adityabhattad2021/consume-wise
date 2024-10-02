import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import RootLayoutClient from "@/components/root-layout-client";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
});

export const metadata: Metadata = {
  title: "ConsumeWise",
  description: "ConsumeWise is an ai powered application that helps you track and improve your food consumption habits",
  icons: {
    icon: "/images/android-chrome-192x192.png",
  },
  openGraph: {
    images: ["/images/android-chrome-192x192.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/android-chrome-192x192.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
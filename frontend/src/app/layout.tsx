import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
});

export const metadata: Metadata = {
  title: "ConsumeWise",
  description: "ConsumeWise is an ai powered application that helps you track and improve your food consumption habits",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        {children}
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/navbar";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
});

export const metadata: Metadata = {
  title: "ConsumeWise",
  description: "TODO",
};

export default function ApplicationLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {children}
      </div>
      {modal}
    </>
  );
}
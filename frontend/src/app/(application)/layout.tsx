import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster"


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
      <Toaster />
    </>
  );
}
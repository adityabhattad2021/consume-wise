import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
});

export const metadata: Metadata = {
  title: "ConsumeWise - Onboarding",
  description: "Onboarding process for ConsumeWise",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
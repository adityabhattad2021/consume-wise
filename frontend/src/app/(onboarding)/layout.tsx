import type { Metadata } from "next";
import "@/app/globals.css";


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
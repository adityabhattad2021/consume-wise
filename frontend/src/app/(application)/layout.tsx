
import "@/app/globals.css";
import { auth } from "@/auth";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster"


export default async function ApplicationLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <Navbar userLoggedIn={session?.user ? true : false} />
      <div className="min-h-screen bg-background pt-24 sm:pt-32">
        {children}
      </div>
      {modal}
      <Toaster />
    </>
  );
}
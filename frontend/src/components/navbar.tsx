import React from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';
import { auth } from "@/auth";
import { Session } from "next-auth";


const CommandK = dynamic(() => import('@/components/command-k'), {
    ssr: false,
    loading: () => <p>Loading...</p>
});

interface NavbarProps {
    className?: string;
}

export default async function Navbar({ className }: NavbarProps) {

    const session = await auth();

    return (
        <nav className={cn("fixed top-6 inset-x-0 mx-auto w-[88%] z-50", className)}>
            <div className="relative rounded-2xl border bg-secondary/80 backdrop-blur-sm text-secondary-foreground shadow-lg flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
                <Link href="/" className="flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-primary" />
                    <h1 className="text-xl md:text-2xl font-bold">ConsumeWise</h1>
                </Link>
                <div className="hidden md:flex items-center space-x-4 gap-4">
                    {session?.user ? (
                        <>
                            <NavLink href="/profile">Profile</NavLink>
                            <NavLink href="#">Add a product</NavLink>
                        </>
                    ) : (
                        <NavLink href="/auth/login">Login</NavLink>
                    )}
                    <CommandK />
                </div>
                <MobileMenu
                    session={session}
                />
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href}>
            <span className="cursor-pointer relative">
                {children}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary opacity-0 transition-opacity duration-200 hover:opacity-100" />
            </span>
        </Link>
    );
}

function MobileMenu({
    session
}: {
    session: Session | null;
}) {
    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <button className="p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] bg-secondary/95 backdrop-blur-lg text-secondary-foreground">
                    <div className="flex flex-col space-y-6 mt-6">
                        <h3 className="text-xl font-semibold border-b border-secondary-foreground/20 pb-2">ConsumeWise</h3>
                        <div className="text-xl font-semibold pt-2">

                            {session?.user ? (
                                <>
                                    <MobileNavLink href="/profile">Profile</MobileNavLink>
                                    <MobileNavLink href="#">Add a product</MobileNavLink>
                                </>
                            ) : (
                                <MobileNavLink href="/auth/login">Login</MobileNavLink>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href}>
            <span className="block py-2 px-3 hover:bg-primary/10 rounded-md transition-colors">
                {children}
            </span>
        </Link>
    );
}
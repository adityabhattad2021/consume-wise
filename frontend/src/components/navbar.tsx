"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { CommandK } from "@/components/command-k";

interface NavbarProps {
    className?: string;
}

export default function Navbar({ className }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn("fixed top-6 inset-x-0 mx-auto w-[88%] z-50", className)}
        >
            <nav className="relative rounded-2xl border bg-secondary/80 backdrop-blur-sm text-secondary-foreground shadow-lg flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
                <Link href="/">
                    <motion.h1
                        whileHover={{ scale: 1.05 }}
                        className="text-xl md:text-2xl font-bold"
                    >
                        ConsumeWise
                    </motion.h1>
                </Link>
                <div className="hidden md:flex items-center space-x-4 gap-4">
                    <NavLink href="#">Add a product</NavLink>
                    <NavLink href="#">Profile</NavLink>
                    <CommandK/>
                </div>
                <div className="md:hidden flex items-center">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-md"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-6 h-6"
                                >
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            </motion.button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-[300px] bg-secondary/95 backdrop-blur-lg text-secondary-foreground"
                        >
                            <div className="flex flex-col space-y-6 mt-6">
                                <div className="flex flex-col space-y-3">
                                    <h3 className="text-xl font-semibold border-b border-secondary-foreground/20 pb-2">
                                        FoodFacts101
                                    </h3>
                                </div>
                                <div className="text-xl font-semibold pt-2">
                                    <MobileNavLink href="#" onClick={() => setIsOpen(false)}>
                                        Add a product
                                    </MobileNavLink>
                                    <MobileNavLink href="#" onClick={() => setIsOpen(false)}>
                                        Profile
                                    </MobileNavLink>

                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </motion.div>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href}>
            <motion.span
                className="cursor-pointer relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {children}
                <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                />
            </motion.span>
        </Link>
    );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link href={href}>
            <motion.span
                className="block py-2 px-3 hover:bg-primary/10 rounded-md transition-colors"
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
            >
                {children}
            </motion.span>
        </Link>
    );
}
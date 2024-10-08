"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";


export function SignOutButton() {
    return (
        <Button
            variant="destructive"
            onClick={
                () => signOut({
                    redirectTo: '/'
                })
            }
        >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
        </Button>
    )
}
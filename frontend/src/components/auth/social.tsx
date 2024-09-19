"use client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react"


export function Social() {

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={()=>signIn("google",{redirectTo:'/users/new'})}
            >
                <FcGoogle className="h-5 w-5" />
            </Button>
        </div>
    )
}
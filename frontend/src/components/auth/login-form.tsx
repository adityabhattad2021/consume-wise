"use client";

import { Card, CardContent, CardHeader } from "../ui/card";
import { BackButton } from "./back-button";
import { Header } from "./header";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react"

interface LoginFormProps {
    callbackUrl?: string;
}

export function LoginForm({
    callbackUrl = "/"
}: LoginFormProps) {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header label={"Continue with Google"} />
            </CardHeader>
            <CardContent>
                <div className="flex items-center p-6 pt-0">
                    <div className="flex items-center w-full gap-x-2">
                        <Button
                            size="lg"
                            className="w-full"
                            variant="outline"
                            onClick={() => signIn("google", { redirectTo: callbackUrl })}
                        >
                            <FcGoogle className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center p-6 pt-0">
                    <BackButton
                        href={"/"}
                        label={"Go back ->"}
                    />
                </div>
            </CardContent>

        </Card>
    )
}
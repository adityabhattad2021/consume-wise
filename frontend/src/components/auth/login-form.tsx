"use client";

import { Card, CardContent, CardHeader } from "../ui/card";
import { BackButton } from "./back-button";
import { Header } from "./header";
import { Social } from "./social";


export function LoginForm() {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header label={"Continue with Google"} />
            </CardHeader>
            <CardContent>
                <div className="flex items-center p-6 pt-0">
                    <Social />
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
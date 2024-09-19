"use client";
import { LoginForm } from "@/components/auth/login-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function InterceptedLoginPage() {
    const router = useRouter();

    function handleOpenChange() {
        router.back()
    }

    return (
        <Dialog
            defaultOpen={true}
            open={true}
            onOpenChange={handleOpenChange}
        >
            <DialogContent className="p-0 w-auto bg-transparent border-none">
                <LoginForm />
            </DialogContent>
        </Dialog>
    )
}
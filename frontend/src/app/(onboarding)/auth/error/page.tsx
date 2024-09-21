import { ErrorCard } from "@/components/auth/error-card";

export default function AuthErrorPage() {
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <ErrorCard />
        </div>
    )
}
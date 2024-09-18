import { cn } from "@/lib/utils";
import { CheckCircle, MessageCircleWarningIcon } from "lucide-react";

interface FormMessageProps {
    message?: string;
    type: string;
}

export function FormMessage({
    message,
    type
}: FormMessageProps) {
    if (!message) return null;
    return (
        <div
            className={cn("p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive", 
            type === "success" ?
                "bg-emerald-500/15 text-emerald-500" : "bg-destructive/15 text-destructive"
            )}
        >
            {
                type === "success" && (
                    <CheckCircle
                        className="h-4 w-4"
                    />
                )
            }
            {
                type === "error" && (
                    <MessageCircleWarningIcon
                        className="h-4 w-4"
                    />
                )
            }
            <p>
                {message}
            </p>
        </div>
    )
}
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export function Social() {

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                size="lg"
                className="w-full"
                variant="outline"
            >
                <FcGoogle className="h-5 w-5" />
            </Button>
        </div>
    )
}
"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BackButtonProps {
    label: string;
}

export function BackButton({
    label
}: BackButtonProps) {

    const router = useRouter();

    function handleClick(){
        router.back()
    }

    return (
        <Button
            variant={"link"}
            className="font-normal w-full"
            size={"sm"}
            onClick={handleClick}
        >
            {label}
        </Button>
    )
}
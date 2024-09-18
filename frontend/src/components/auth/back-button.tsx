"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BackButtonProps {
    href: string;
    label: string;
}

export function BackButton({
    href,
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
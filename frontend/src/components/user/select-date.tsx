"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SelectDateProps {
    availableDates: Date[];
}

export default function SelectDate({ availableDates }: SelectDateProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(availableDates.length > 0 ? availableDates[availableDates.length - 1].toISOString() : undefined);
    useEffect(() => {
        function handleDateChange(date: string) {
            const params = new URLSearchParams(searchParams);
            if (date) {
                params.set("date", date);
            } else {
                params.delete("date");
            }
            router.replace(`${pathname}?${params.toString()}`);

        }
        if (selectedDate !== undefined) {
            handleDateChange(selectedDate);
        }
    }, [selectedDate, router, pathname, searchParams]);





    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-500">Select day:</span>
                <Select onValueChange={(value) => setSelectedDate(value)} value={selectedDate}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="No date found" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableDates.map((day) => (
                            <SelectItem key={day.toISOString()} value={day.toISOString()}>
                                {day.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

        </div>
    )
}   
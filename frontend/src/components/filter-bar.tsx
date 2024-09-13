'use client';
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
// import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

type FilterBarProps = {
    categories: Category[];
};

export default function FilterBar({ categories }: FilterBarProps) {
    // const router = useRouter();
    // const searchParams = useSearchParams();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

    const toggleCategory = (category: Category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 200; 
            const newScrollPosition = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative w-full pb-4">
            <div 
                ref={scrollRef}
                className="flex w-full space-x-4 p-4 overflow-x-auto no-scrollbar"
            >
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        variant="outline"
                        onClick={() => toggleCategory(category)}
                        className={`flex-shrink-0 transition-all duration-200 ${
                            selectedCategories.includes(category)
                                ? 'bg-secondary'
                                : 'hover:bg-secondary'
                        }`}
                    >
                        {category.name}
                    </Button>
                ))}
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-[40%] -translate-y-1/2 bg-transparent"
                onClick={() => scroll('left')}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-[40%] -translate-y-1/2 bg-transparent"
                onClick={() => scroll('right')}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
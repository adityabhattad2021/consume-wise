'use client';

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";


export default function FilterBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [products, setProducts] = useState([])
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        brand: searchParams.get('brand') || '',
        ingredient: searchParams.get('ingredient') || '',
        claim: searchParams.get('claim') || '',
        allergen: searchParams.get('allergen') || '',
        minCalories: searchParams.get('minCalories') || '',
        maxCalories: searchParams.get('maxCalories') || '',
        minProtein: searchParams.get('minProtein') || '',
        maxProtein: searchParams.get('maxProtein') || '',
    })
    const handleFilterChange = (key: any, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        router.push(`/?${new URLSearchParams({ ...filters, [key]: value }).toString()}`)
    }

    return (
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
                placeholder="Category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
            />
            <Input
                placeholder="Brand"
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
            />
            <Input
                placeholder="Ingredient"
                value={filters.ingredient}
                onChange={(e) => handleFilterChange('ingredient', e.target.value)}
            />
            <Input
                placeholder="Claim"
                value={filters.claim}
                onChange={(e) => handleFilterChange('claim', e.target.value)}
            />
            <Input
                placeholder="Allergen (exclude)"
                value={filters.allergen}
                onChange={(e) => handleFilterChange('allergen', e.target.value)}
            />
            <Input
                type="number"
                placeholder="Min Calories"
                value={filters.minCalories}
                onChange={(e) => handleFilterChange('minCalories', e.target.value)}
            />
            <Input
                type="number"
                placeholder="Max Calories"
                value={filters.maxCalories}
                onChange={(e) => handleFilterChange('maxCalories', e.target.value)}
            />
            <Input
                type="number"
                placeholder="Min Protein"
                value={filters.minProtein}
                onChange={(e) => handleFilterChange('minProtein', e.target.value)}
            />
            <Input
                type="number"
                placeholder="Max Protein"
                value={filters.maxProtein}
                onChange={(e) => handleFilterChange('maxProtein', e.target.value)}
            />
        </div>
    )
}
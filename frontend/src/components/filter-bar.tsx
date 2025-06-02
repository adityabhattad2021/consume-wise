'use client'
import React, { useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Category } from "@prisma/client"
import { ChevronLeft, ChevronRight } from "lucide-react"

type FilterBarProps = {
  categories: Category[]
}

export default function FilterBar({ categories }: FilterBarProps) {
  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const scrollRef = useRef<HTMLDivElement>(null)

  const selectedCategories = useMemo(() => {
    const categoryParam = searchParams.get('categories')
    return categoryParam ? categoryParam.split(',') : []
  }, [searchParams])

  const toggleCategory = useCallback((categoryId: string) => {
    const params = new URLSearchParams(searchParams)
    const currentCategories = params.get('categories')?.split(',') || []
    const updatedCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId]

    if (updatedCategories.length > 0) {
      params.set('categories', updatedCategories.join(','))
    } else {
      params.delete('categories')
    }

    replace(`${pathname}?${params.toString()}`)
  }, [searchParams, pathname, replace])

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      const newScrollPosition = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      })
    }
  }, [])

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
            onClick={() => toggleCategory(String(category.id))}
            className={`flex-shrink-0 transition-all duration-200 ${
              selectedCategories.includes(String(category.id))
                ? 'bg-secondary text-secondary-foreground'
                : 'hover:bg-secondary/50 hover:text-secondary-foreground'
            }`}
          >
            {category.name}
          </Button>
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-[40%] -translate-y-1/2 bg-background/80 backdrop-blur-sm"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-[40%] -translate-y-1/2 bg-background/80 backdrop-blur-sm"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
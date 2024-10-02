'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'


export default function SearchProducts() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])


  const handleSearch = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >

          <div className='inline-block sm:hidden'>
            <Search className="w-5 h-5" />
          </div>

          <div className='hidden sm:inline-block'>
            <span>Search</span>
            <kbd className="hidden px-2 py-1 ml-2 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded sm:inline-block">
              ⌘K
            </kbd>
          </div>

        </Button>
      </DialogTrigger >
      <DialogContent className="p-0 overflow-hidden bg-white rounded-lg shadow-xl sm:max-w-2xl">
        <DialogTitle className="sr-only">Search Products</DialogTitle>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Product Search
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                ref={inputRef}
                type="text"
                defaultValue={searchParams.get('query')?.toString()}
                placeholder="What are you looking for?"
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-10 py-2 w-full text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                aria-label="Search input"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog >
  )
}
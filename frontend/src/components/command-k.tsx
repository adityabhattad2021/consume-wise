'use client'
import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {  SearchIcon } from 'lucide-react'
import Image from 'next/image'

export default function CommandK() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

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

  const handleSearch = async () => {
    // Implement search functionality
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <span>Search</span>
          <kbd className="hidden px-2 py-1 ml-2 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded sm:inline-block">
            ⌘K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 overflow-hidden bg-white rounded-lg shadow-xl max-w-2xl">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Let me filter the products for you!
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="What are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
                className="pl-10 pr-4 py-2 w-full text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                aria-label="Search input"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={query.trim() === ''}
              className="p-2 bg-white text-black rounded-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            >
              <Image
                width={24}
                height={24}
                src="/images/gemini.png"
                alt="gemini logo"
                className="transition-transform duration-200 transform hover:scale-110"
              />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
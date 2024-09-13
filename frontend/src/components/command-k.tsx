'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CommandIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'



export function CommandK() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
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
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <div className="flex items-center justify-center p-2 bg-gray-100 border border-black text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 transition-colors">
                    <CommandIcon className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">K</span>
                </div>
            </DialogTrigger>
            <DialogContent className="p-0 bg-white rounded-lg shadow-lg max-w-2xl">
                <DialogHeader className="px-4 py-2 border-b">
                    <DialogTitle className="text-lg font-semibold">Let me filter the products for you!</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <div className="flex items-center gap-2">
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
                            className="flex-1"
                            aria-label="Search input"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={isLoading || query.trim() === ''}
                            variant="ghost"
                            size="icon"
                            className="p-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Image width={20} height={20} src="/images/gemini.png" alt="gemini logo" />
                            )}
                        </Button>
                    </div>
                    {error && (
                        <p className="mt-2 text-sm text-red-500" role="alert">
                            {error}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
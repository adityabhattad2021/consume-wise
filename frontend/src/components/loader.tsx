import { LoaderIcon } from "lucide-react"

interface LoaderProps {
  className?: string
}

export default function Loader({ className = "" }: LoaderProps) {
  return (
    <div className={`flex justify-center items-center w-full h-full ${className}`}>
      <LoaderIcon className="animate-spin w-10 h-10 text-primary" />
    </div>
  )
}
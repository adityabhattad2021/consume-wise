import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"

interface ProductGridProps {
  products: { 
    id: number
    name: string, 
    imageUrl: string[], 
    brand: string, 
  }[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`} className="group">
          <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/25 bg-background dark:bg-background">
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={product.imageUrl[0] || '/placeholder.png'}
                alt={product.name}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardContent className="p-4 ">
              <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-primary ">
                {product.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
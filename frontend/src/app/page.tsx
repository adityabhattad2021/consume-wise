import { Suspense } from 'react'
import { getProducts } from '@/lib/products'
import ProductGrid from '@/components/product-grid'
import { Skeleton } from '@/components/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function AllProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <main className="w-full">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductList />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

async function ProductList() {
  const products = await getProducts()
  return <ProductGrid products={products} />
}

interface ProductGridSkeletonProps {
  count?: number;
}

function ProductGridSkeleton({ count = 8 }:ProductGridSkeletonProps){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="h-full overflow-hidden bg-background dark:bg-background">
          <div className="aspect-square relative overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

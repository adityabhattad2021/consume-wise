import { Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getProducts } from "@/lib/products";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/categories";
import FilterBar from "@/components/filter-bar";
import Loader from '@/components/loader';


export default async function AllProductsPage({
  searchParams,
}: {
  searchParams?: {
    categories?: string;
    query?: string;
  }
}) {

  const query = searchParams?.query || '';
  const categories = searchParams?.categories?.split(',') || [];
  const allCategoriesPromise = getCategories();
  const allProductsPromise = getProducts(categories, query);

  return (
    <main className="container mx-auto px-4 pb-16 w-[90%]">
      <Suspense fallback={<Loader className="h-16" />}>
        <FilterBarWrapper categoriesPromise={allCategoriesPromise} />
      </Suspense>
      <Suspense fallback={<ProductGridSkeleton/>}>
        <ProductGrid productsPromise={allProductsPromise} />
      </Suspense>
    </main>
  );
}

/* eslint-disable */
async function FilterBarWrapper({ categoriesPromise }: { categoriesPromise: Promise<any[]> }) {
  const allCategories = await categoriesPromise;
  return <FilterBar categories={allCategories} />;
}

async function ProductGrid({ productsPromise }: { productsPromise: Promise<any[]> }) {
  const allProducts = await productsPromise;
  return (
    <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {allProducts.length > 0 ? (
        allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p className="text-center col-span-full text-muted-foreground">No products found.</p>
      )}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
      {[...Array(8)].map((_, index) => (
        <Card key={index} className="flex flex-col animate-pulse">
          <CardContent className="p-4 flex-grow flex flex-col">
            <div className="w-full h-56 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="w-full h-10 bg-gray-200 rounded"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: any }) {
  return (
    <Card className="flex flex-col">
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="w-full h-56 relative mb-4 border-2 rounded-xl overflow-hidden">
          {product.imageUrl.length > 0 && (
            <Card className="relative overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {product.imageUrl.map((url: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square">
                        <Image
                          src={url}
                          alt={`${product.name} - Image ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover rounded-lg"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
              </Carousel>
            </Card>
          )}
        </div>
        <h2 className="text-lg font-semibold line-clamp-1">{product.name}</h2>
        <p className="text-xs text-muted-foreground mt-1">
          by {product.brand}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/products/${product.id}`} className="w-full">
          <Button className="w-full h-10">View Product</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
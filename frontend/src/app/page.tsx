import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getProducts } from "@/lib/products"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Image from "next/image"
import Link from "next/link"

export default async function AllProductsPage() {
  const allProducts = await getProducts()

  return (


    <main className="container mx-auto px-4 pt-32 pb-16">
      <div className="w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {allProducts.length > 0 ? (
          allProducts.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardContent className="p-4 flex-grow flex flex-col">
                <div className="w-full h-56 relative mb-4 border-2 rounded-xl overflow-hidden">
                  {product.imageUrl.length > 0 && (
                    <Card className="relative overflow-hidden">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {product.imageUrl.map((url, index) => (
                            <CarouselItem key={index}>
                              <div className="relative aspect-square">
                                <Image
                                  src={url}
                                  alt={`${product.name} - Image ${index + 1}`}
                                  fill
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
          ))
        ) : (
          <p className="text-center col-span-full text-muted-foreground">No products found.</p>
        )}
      </div>
    </main>

  )
}
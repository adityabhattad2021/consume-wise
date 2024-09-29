import Image from 'next/image'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from "@/components/ui/button"
import { Suspense } from 'react'
import { Card } from '@/components/ui/card';
import ConsumeProduct from '@/components/product/consume-product';
import Link from 'next/link';
import { capitalizeWords } from '@/lib/capitalize_word';



interface ProductBasicInfoProps {
    product: {
        id: number;
        imageUrl: string[]
        name: string;
        vendorProductUrl: string;
        venderName: string;
    }
    isLoggedIn: boolean;
}

export default function ProductBasicInfo({
    product,
    isLoggedIn
}: ProductBasicInfoProps) {
    return (
        <div className="lg:w-2/5">
            <div className="sticky top-28">
                {product.imageUrl.length > 0 && (
                    <Card className="relative overflow-hidden">
                        <Suspense fallback={<div>Loading...</div>}>
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {product.imageUrl.map((url, index) => (
                                        <CarouselItem key={index}>
                                            <div className="relative aspect-square">
                                                <Image
                                                    src={url}
                                                    alt={`${product.name} - Image ${index + 1}`}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover rounded-lg"
                                                    priority={index === 0}
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                            </Carousel>
                        </Suspense>
                    </Card>
                )}
                <div className="space-y-4 mt-4">
                    <Button className="w-full">
                        <Link href={product.vendorProductUrl} target="_blank">
                            Go to {capitalizeWords(product.venderName)}
                        </Link>
                    </Button>
                    {isLoggedIn && (
                        <ConsumeProduct
                            productId={product.id}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
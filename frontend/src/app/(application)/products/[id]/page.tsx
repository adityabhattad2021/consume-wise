import { getProductBasicInfo } from '@/lib/products'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Skeleton from "@/components/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProductBasicInfo from '@/components/product/product-basic-info'
import ProductOverview from '@/components/product/product-overview'
import ProductNutrition from '@/components/product/product-nutrition'
import ProductIngredient from '@/components/product/product-ingredient'
import ProductClaim from '@/components/product/product-claim'



export default async function ProductDetailsPage({
  params
}: {
  params: {
    id: string
  }
}) {

  const productId = Number(params.id);
  const basicInfoPromise = getProductBasicInfo(productId);
  const basicInfo = await basicInfoPromise;
  if (!basicInfo) {
    notFound()
  }


  return (
    <div className="container mx-auto px-10 md:px-24 py-8 pt-32">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
        <Suspense fallback={<ProductBasicInfoSkeleton />}>
          <ProductBasicInfo product={basicInfo} />
        </Suspense>
        <div className="lg:w-3/5">
          <h1 className="text-4xl font-bold mb-2">{basicInfo.name}</h1>
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg text-gray-600">By: {basicInfo.brand}</p>
            <Badge variant="secondary">Added by: Team ConsumeWise</Badge>
          </div>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="w-full grid grid-cols-4 gap-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="claims">Claims</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Suspense fallback={<ProductOverviewSkeleton />}>
                <ProductOverview productId={productId} />
              </Suspense>
            </TabsContent>

            <TabsContent value="nutrition">
              <Suspense fallback={<ProductNutritionSkeleton />}>
                <ProductNutrition productId={productId} />
              </Suspense>
            </TabsContent>

            <TabsContent value="ingredients">
              <Suspense fallback={<ProductIngredientSkeleton />}>
                <ProductIngredient productId={productId} />
              </Suspense>
            </TabsContent>

            <TabsContent value="claims">
              <Suspense fallback={<ProductClaimSkeleton />}>
                <ProductClaim productId={productId} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function ProductBasicInfoSkeleton() {
  return (
    <div className="lg:w-1/3">
      <div className="sticky top-28">
        <Card className="relative overflow-hidden">
          <Skeleton className="w-full aspect-square" />
        </Card>
        <div className="space-y-4 mt-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}

function ProductOverviewSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div>
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductNutritionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutritional Information</CardTitle>
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ProductIngredientSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
      </CardHeader>
      <CardContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="mb-4">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ProductClaimSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Claims</CardTitle>
      </CardHeader>
      <CardContent>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="mb-6 p-4 bg-gray-100 rounded-lg">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
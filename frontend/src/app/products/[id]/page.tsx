import { getProduct } from '@/lib/products'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Leaf, AlertTriangle, Check, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DetailedProduct } from '@/lib/products'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

const nutritionKeys = [
  "calories", "totalFat", "saturatedFat", "transFat", "cholesterol", "sodium",
  "totalCarbohydrate", "dietaryFiber", "totalSugars", "addedSugars", "protein",
  "vitaminA", "vitaminC", "calcium", "iron"
]

const formatNutritionLabel = (key: string) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
}

const getUnitForNutrient = (nutrient: string) => {
  if (["calories"].includes(nutrient)) return ""
  if (["vitaminA", "vitaminC", "calcium", "iron"].includes(nutrient)) return "%"
  return "g"
}

const calculateHealthScore = (product: DetailedProduct) => {
  let score = 50 // Start at neutral
  if (product.nutritionalFacts) {
    score += product.nutritionalFacts.protein || 0 > 10 ? 10 : 0
    score -= product.nutritionalFacts.saturatedFat || 0 > 5 ? 10 : 0
    score += product.nutritionalFacts.dietaryFiber || 0 > 5 ? 10 : 0
    score -= product.nutritionalFacts.addedSugars || 0 > 10 ? 10 : 0
  }
  return Math.min(Math.max(score, 0), 100) // Ensure score is between 0 and 100
}

export default async function ProductDetailsPage({
  params
}: {
  params: {
    id: string
  }
}) {
  const product = await getProduct(Number(params.id));
  if (!product) {
    redirect("/")
  }

  const healthScore = calculateHealthScore(product)

  return (
    <div className="container mx-auto px-10 md:px-24 py-8 pt-32">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <div className="sticky top-28">
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
            <div className="space-y-4 mt-4">
              <Button className="w-full">Buy Here</Button>
              <Button variant="outline" className="w-full">Add to Archive</Button>
            </div>
          </div>
        </div>
        <div className="lg:w-2/3">
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg text-gray-600">By: {product.brand}</p>
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
              <Card>
                <CardHeader>
                  <CardTitle>Product Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-6">{product.summary}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Key Nutrients</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {product.nutritionalFacts && (
                          <>
                            <li>Protein: {product.nutritionalFacts.protein}g</li>
                            <li>Total Fat: {product.nutritionalFacts.totalFat}g</li>
                            <li>Total Carbohydrates: {product.nutritionalFacts.totalCarbohydrate}g</li>
                            <li>Dietary Fiber: {product.nutritionalFacts.dietaryFiber}g</li>
                          </>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Main Ingredients</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {product.ingredients.slice(0, 5).map((ingredient, index) => (
                          <li key={index}>{ingredient.ingredient.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    <h4 className="text-lg font-semibold mb-2">Health Score</h4>
                    <Progress value={healthScore} className="w-full h-4" />
                    <p className="text-sm text-gray-600 mt-2">Score: {healthScore}/100</p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition">
              <Card>
                <CardHeader>
                  <CardTitle>Nutritional Information</CardTitle>
                  <CardDescription>Per serving ({product.servingSize} {product.servingUnit})</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {nutritionKeys.map((nutrient) => (
                      product.nutritionalFacts && product.nutritionalFacts[nutrient as keyof typeof product.nutritionalFacts] !== null && (
                        <div key={nutrient} className="flex justify-between items-center py-2 border-b">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="font-medium underline decoration-dotted">
                                {formatNutritionLabel(nutrient)}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Explanation of {formatNutritionLabel(nutrient)} and its impact on health.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <span className="font-semibold">
                            {product.nutritionalFacts[nutrient as keyof typeof product.nutritionalFacts]}
                            {getUnitForNutrient(nutrient)}
                          </span>
                        </div>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ingredients">
              <Card>
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {product.ingredients.map((ingredient, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{ingredient.ingredient.name}</AccordionTrigger>
                        <AccordionContent>
                          <p className="mb-3">{ingredient.ingredient.description}</p>
                          <p className="mb-3"><strong>Common Uses:</strong> {ingredient.ingredient.commonUses}</p>
                          <p className="mb-3"><strong>Potential Risks:</strong> {ingredient.ingredient.potentialRisks}</p>
                          <h4 className="font-semibold mt-4 mb-3">Effects:</h4>
                          {ingredient.effects.map((effect, effectIndex) => {
                            return (
                              <div key={effectIndex} className="mb-4 p-4 bg-gray-100 rounded-lg">
                                <p className="font-medium flex items-center">
                                  {effect.effectType === 'health benefit'
                                    ? <Leaf className="w-5 h-5 mr-2 text-green-500" />
                                    : <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />}
                                  {effect.description}
                                </p>
                                <p className="text-sm mt-2"><strong>Evidence:</strong> {effect.scientificEvidence}</p>
                                <p className="text-sm"><strong>Severity:</strong> {effect.severity}</p>
                                <p className="text-sm"><strong>Duration:</strong> {effect.duration}</p>
                              </div>
                            )
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="claims">
              <Card>
                <CardHeader>
                  <CardTitle>Product Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  {product.claims.map((claim, index) => (
                    <div key={index} className="mb-6 p-4 bg-gray-100 rounded-lg">
                      <p className="font-medium mb-2">{claim.claim}</p>
                      <div className="flex items-center mb-2">
                        <Badge variant={claim.verificationStatus === 'Verified' ? 'default' : 'secondary'}>
                          {claim.verificationStatus === 'Verified' ? <Check className="w-4 h-4 mr-1" /> : <Info className="w-4 h-4 mr-1" />}
                          {claim.verificationStatus}
                        </Badge>
                      </div>
                      <p className="text-sm mb-1"><strong>Explanation:</strong> {claim.explanation}</p>
                      <p className="text-sm"><strong>Source:</strong> {claim.source}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )

}
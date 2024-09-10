"use client"
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Leaf, AlertTriangle, Check,  Info } from 'lucide-react'
import { DetailedProduct } from '@/lib/products';


interface ProductDetailsProps {
    product: DetailedProduct
}

export function ProductDetails({
    product
}: ProductDetailsProps) {

    const [activeTab, setActiveTab] = useState("overview")

    const nutritionKeys = [
        "calories",
        "totalFat",
        "saturatedFat",
        "transFat",
        "cholesterol",
        "sodium",
        "totalCarbohydrate",
        "dietaryFiber",
        "totalSugars",
        "addedSugars",
        "protein",
        "vitaminA",
        "vitaminC",
        "calcium",
        "iron"
    ];


    const formatNutritionLabel = (key: string) => {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
    }

    const getUnitForNutrient = (nutrient: string) => {
        if (["calories"].includes(nutrient)) return ""
        if (["vitaminA", "vitaminC", "calcium", "iron"].includes(nutrient)) return "%"
        return "g"
    }

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
                    <CardDescription className="text-xl">{product.brand}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {product.categories.map((category, index) => (
                            <Badge key={index} variant="secondary">{category.category.name}</Badge>
                        ))}
                    </div>
                    <p className="text-lg mb-2">Serving Size: {product.servingSize}{product.servingUnit}</p>
                    <div className="flex flex-wrap gap-2">
                        {product.allergens.map((allergen, index) => (
                            <Badge key={index} variant="destructive">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                {allergen.allergen.name}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

                <TabsList className="w-full flex justify-around">
                    <TabsTrigger className='flex-1' value="overview">Overview</TabsTrigger>
                    <TabsTrigger className='flex-1' value="nutrition">Nutrition</TabsTrigger>
                    <TabsTrigger className='flex-1' value="ingredients">Ingredients</TabsTrigger>
                    <TabsTrigger className='flex-1' value="claims">Claims</TabsTrigger>
                </TabsList>


                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg mb-4">
                                {product.name} by {product.brand} is a {product.categories.map((cat) => cat.category.name).join("/")} designed to provide a nutritious and energizing snack. With {product.nutritionalFacts?.protein || 0}g of protein per serving, it&apos;s an excellent choice for those looking to support their active lifestyle.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Key Nutrients</h3>
                                    <ul className="list-disc list-inside">
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
                                    <h3 className="font-semibold mb-2">Main Ingredients</h3>
                                    <ul className="list-disc list-inside">
                                        {product.ingredients.slice(0, 5).map((ingredient, index) => (
                                            <li key={index}>{ingredient.ingredient.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="nutrition" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nutritional Information</CardTitle>
                            <CardDescription>Per serving ({product.servingSize}{product.servingUnit})</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {nutritionKeys.map((nutrient) => (
                                    product.nutritionalFacts !== null && product.nutritionalFacts[nutrient as keyof typeof product.nutritionalFacts] !== null && (
                                        <div key={nutrient} className="flex justify-between items-center">
                                            <span className="font-medium">{formatNutritionLabel(nutrient)}</span>
                                            <span>{product.nutritionalFacts[nutrient as keyof typeof product.nutritionalFacts]}{getUnitForNutrient(nutrient)}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ingredients" className="space-y-4">
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
                                            <p className="mb-2">{ingredient.ingredient.description}</p>
                                            <p className="mb-2"><strong>Common Uses:</strong> {ingredient.ingredient.commonUses}</p>
                                            <p className="mb-2"><strong>Potential Risks:</strong> {ingredient.ingredient.potentialRisks}</p>
                                            <h4 className="font-semibold mt-4 mb-2">Effects:</h4>
                                            {ingredient.effects.map((effect, effectIndex) => (
                                                <div key={effectIndex} className="mb-4 p-4 bg-gray-100 rounded-lg">
                                                    <p className="font-medium">{effect.effectType === 'health benefit' ? <Leaf className="inline w-5 h-5 mr-2 text-green-500" /> : <AlertTriangle className="inline w-5 h-5 mr-2 text-yellow-500" />}{effect.description}</p>
                                                    <p className="text-sm mt-2"><strong>Evidence:</strong> {effect.scientificEvidence}</p>
                                                    <p className="text-sm"><strong>Severity:</strong> {effect.severity}</p>
                                                    <p className="text-sm"><strong>Duration:</strong> {effect.duration}</p>
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="claims" className="space-y-4">
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
    )
}
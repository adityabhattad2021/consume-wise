import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { getProductIngredients } from "@/lib/products";
import { AlertTriangle, Leaf } from "lucide-react";

interface ProductIngredientProps{
    productId:number;
}

export default async function ProductIngredient({
    productId
}:ProductIngredientProps) {
    const product = await getProductIngredients(productId);
    
    if(!product){
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<div>Loading...</div>}>
                    <Accordion type="single" collapsible className="w-full">
                        {product.ingredients.map((ingredient, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{ingredient.name}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="mb-3">{ingredient.description}</p>
                                    <p className="mb-3"><strong>Common Uses:</strong> {ingredient.commonUses}</p>
                                    <p className="mb-3"><strong>Potential Risks:</strong> {ingredient.potentialRisks}</p>
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
                </Suspense>
            </CardContent>
        </Card>
    )
}
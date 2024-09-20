import { getProductNutrition } from "@/lib/products";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const formatNutritionLabel = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
}

const getUnitForNutrient = (nutrient: string) => {
    if (["calories"].includes(nutrient)) return ""
    if (["vitaminA", "vitaminC", "calcium", "iron"].includes(nutrient)) return "%"
    return "g"
}

const nutritionKeys = [
    "calories", "totalFat", "saturatedFat", "transFat", "cholesterol", "sodium",
    "totalCarbohydrate", "dietaryFiber", "totalSugars", "addedSugars", "protein",
    "vitaminA", "vitaminC", "calcium", "iron"
]


interface ProductNutritionProps{
    productId:number;
}

export default async function ProductNutrition({
    productId
}:ProductNutritionProps) {
    const product = await getProductNutrition(productId);
    if(!product){
        return null;
    }

    return (
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
    )
}
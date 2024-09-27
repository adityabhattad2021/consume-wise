import { getProductNutrition } from "@/lib/products"
import { PersonalizedOverview } from "@/lib/personalization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Info } from "lucide-react"

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

interface ProductNutritionProps {
    productId: number
    personalizedOverviewPromise: Promise<PersonalizedOverview | null> | null
}

export default async function ProductNutrition({
    productId,
    personalizedOverviewPromise
}: ProductNutritionProps) {
    const product = await getProductNutrition(productId)
    if (!product) {
        return null
    }
    const personalizedOverview = await personalizedOverviewPromise

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Nutritional Information</CardTitle>
                <CardDescription>
                    Per serving ({product.servingSize} {product.servingUnit})
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <NutritionFacts product={product} />
                <NutrientHighlights personalizedOverview={personalizedOverview} />
            </CardContent>
        </Card>
    )
}

function NutritionFacts({ product }: { product: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nutritionKeys.map((nutrient) => (
                product.nutritionalFacts && product.nutritionalFacts[nutrient as keyof typeof product.nutritionalFacts] !== null && (
                    <NutrientItem
                        key={nutrient}
                        nutrient={nutrient}
                        value={product.nutritionalFacts[nutrient as keyof typeof product.nutritionalFacts]}
                    />
                )
            ))}
        </div>
    )
}

function NutrientItem({ nutrient, value }: { nutrient: string; value: number }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="font-medium text-left">
                        <span className="underline decoration-dotted">{formatNutritionLabel(nutrient)}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-xs">Explanation of {formatNutritionLabel(nutrient)} and its impact on health.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Badge variant="secondary" className="text-xs font-semibold">
                {value}{getUnitForNutrient(nutrient)}
            </Badge>
        </div>
    )
}

function NutrientHighlights({ personalizedOverview }: { personalizedOverview: PersonalizedOverview | null }) {
    if (!personalizedOverview?.nutrientHighlights) {
        return null
    }

    return (
        <div className="space-y-4 mt-6">
            <h1 className="text-lg font-semibold">
                Key Nutrients for you
            </h1>
            {personalizedOverview.nutrientHighlights.map((highlight, index) => (
                <div key={index} className="flex items-start bg-muted rounded-lg p-4">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-semibold text-md mb-1">{highlight.nutrient}</h4>
                        <p className="text-muted-foreground text-sm">{highlight.benefit}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
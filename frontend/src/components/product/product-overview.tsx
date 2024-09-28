import { getProductOverview } from "@/lib/products";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "@/components/ui/progress";
import { PersonalizedOverview } from "@/lib/personalization";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Info, XCircle } from "lucide-react";
import { capitalizeWords } from "@/lib/capitalize_word";
import { NutritionalFact, Product } from "@prisma/client";

interface ProductOverviewProps {
    productId: number;
    personalizedOverviewPromise: Promise<PersonalizedOverview | null> | null;
}

type ProductWithNutritionalFactsAndIngredients = Partial<Product> & {
    nutritionalFacts: Partial<NutritionalFact> | null;
    ingredients: { ingredient:{name: string;} }[]
}

export default async function ProductOverview({
    productId,
    personalizedOverviewPromise
}: ProductOverviewProps) {
    const product = await getProductOverview(productId);
    if (!product) {
        return null;
    }
    const personalizedOverview = await personalizedOverviewPromise;

    return (
        <Card>
            <CardHeader className="pb-0">
                {personalizedOverview ? (
                    <>
                        <CardTitle className="text-xl font-bold">Personalized Overview</CardTitle>
                        <CardDescription >
                            This is generated based on your health profile and preferences.
                        </CardDescription>
                    </>
                ) : (
                    <>
                        <CardTitle className="text-xl font-bold">Overview</CardTitle>
                        <CardDescription>
                            This is generated based on the product&apos;s nutritional facts and ingredients.
                        </CardDescription>
                    </>
                )}
            </CardHeader>
            <CardContent>
                <p className="text-sm mb-4 leading-relaxed">
                    {personalizedOverview?.overview ?? product.summary}
                </p>

                {personalizedOverview ? (
                    <PersonalizedContent personalizedOverview={personalizedOverview} />
                ) : (
                    <GeneralContent product={product} />
                )}
                <DetailedContent personalizedOverview={personalizedOverview} />
            </CardContent>
            <CardFooter className="bg-muted p-4">
                <ScoreDisplay
                    score={personalizedOverview?.matchScore ?? product.healthScore}
                    label={personalizedOverview ? "Match Score" : "Health Score"}
                />
            </CardFooter>
        </Card>
    )
}

function PersonalizedContent({ personalizedOverview }: { personalizedOverview: PersonalizedOverview }) {
    return (
        <div className="space-y-4">
            <HealthGoalImpacts impacts={personalizedOverview.healthGoalImpacts} />
            <SuitabilityReasons reasons={personalizedOverview.suitabilityReasons} />
            <SafeConsumptionGuideline guideline={personalizedOverview.safeConsumptionGuideline} />
        </div>
    )
}


interface GeneralContentProps{
    product: ProductWithNutritionalFactsAndIngredients
}

function GeneralContent({ product }:GeneralContentProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h3 className="text-lg font-semibold mb-2">Key Nutrients</h3>
                <ul className="space-y-1">
                    {product.nutritionalFacts && (
                        <>
                            <NutrientItem name="Protein" value={`${product.nutritionalFacts.protein}g`} />
                            <NutrientItem name="Total Fat" value={`${product.nutritionalFacts.totalFat}g`} />
                            <NutrientItem name="Total Carbohydrates" value={`${product.nutritionalFacts.totalCarbohydrate}g`} />
                            <NutrientItem name="Dietary Fiber" value={`${product.nutritionalFacts.dietaryFiber}g`} />
                        </>
                    )}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Main Ingredients</h3>
                <ul className="space-y-1">
                    {product.ingredients.slice(0, 5).map((ingredient: {ingredient:{name:string}}, index: number) => (
                        <li key={index} className="flex items-center">
                            <Info className="w-3 h-3 mr-1 text-primary" />
                            <span className="text-sm">{ingredient.ingredient.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

interface DetailedContentProps{
    personalizedOverview: PersonalizedOverview | null;
}

function DetailedContent({  personalizedOverview }: DetailedContentProps) {
    return (
        <div className="space-y-4 mt-2">
            {personalizedOverview?.nutrientHighlights && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Nutrient Highlights</h3>
                    <ul className="space-y-1">
                        {personalizedOverview.nutrientHighlights.map((highlight, index) => (
                            <li key={index} className="flex items-start">
                                <CheckCircle className="w-4 h-4 mr-1 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">
                                    <strong>{highlight.nutrient}:</strong> {highlight.benefit}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

function HealthGoalImpacts({ impacts }: { impacts: PersonalizedOverview['healthGoalImpacts'] }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Impact on your Health Goals</h3>
            <ul className="space-y-1">
                {impacts.map((impact, index) => (
                    <li key={index} className="flex items-start">
                        <span className="text-sm">
                            <strong>{capitalizeWords(impact.goal)}:</strong> {impact.impact}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function SuitabilityReasons({ reasons }: { reasons: PersonalizedOverview['suitabilityReasons'] }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Suitability</h3>
            <ul className="space-y-1">
                {reasons.map((reason, index) => (
                    <li key={index} className="flex items-start">
                        {reason.type === 'good' ? (
                            <CheckCircle className="w-4 h-4 mr-1 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                            <XCircle className="w-4 h-4 mr-1 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm">{reason.reason}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function SafeConsumptionGuideline({ guideline }: { guideline: PersonalizedOverview['safeConsumptionGuideline'] }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Safe Consumption Guideline</h3>
            <p className="text-sm">
                {guideline.amount} {guideline.unit} {guideline.frequency}
            </p>
        </div>
    )
}

function NutrientItem({ name, value }: { name: string; value: string }) {
    return (
        <li className="flex justify-between items-center">
            <span className="text-sm">{name}</span>
            <Badge variant="secondary" className="text-xs">{value}</Badge>
        </li>
    )
}

function ScoreDisplay({ score, label }: { score: number; label: string }) {
    return (
        <div className="w-full">
            <h4 className="text-lg font-semibold mb-2">{label}</h4>
            <div className="flex items-center space-x-3">
                <Progress value={score} className="w-full h-4" />
                <span className="text-lg font-bold">{score}/100</span>
            </div>
        </div>
    )
}
import { getProductOverview } from "@/lib/products";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "@/components/ui/progress";
import { PersonalizedOverview } from "@/lib/personalization";

interface ProductOverviewProps {
    productId: number;
    personalizedOverviewPromise: Promise<PersonalizedOverview | null> | null;
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
            <CardHeader>
                <CardTitle>Product Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm mb-6">{personalizedOverview?.overview ?? product!.summary}</p>
                {
                    personalizedOverview?.healthGoalImpacts ? (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Health Goal Impacts</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {personalizedOverview.healthGoalImpacts.map((impact, index) => (
                                    <li key={index}>{impact.goal}: {impact.impact}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Key Nutrients</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {product!.nutritionalFacts && (
                                        <>
                                            <li>Protein: {product!.nutritionalFacts.protein}g</li>
                                            <li>Total Fat: {product!.nutritionalFacts.totalFat}g</li>
                                            <li>Total Carbohydrates: {product!.nutritionalFacts.totalCarbohydrate}g</li>
                                            <li>Dietary Fiber: {product!.nutritionalFacts.dietaryFiber}g</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Main Ingredients</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {product!.ingredients.slice(0, 5).map((ingredient, index) => (
                                        <li key={index}>{ingredient.ingredient.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )
                }
            </CardContent>
            <CardFooter>
                {
                    personalizedOverview?.matchScore ? (
                        <div className="w-full">
                            <h4 className="text-lg font-semibold mb-3">Match Score</h4>
                            <Progress value={personalizedOverview.matchScore} className="w-full h-4" />
                            <p className="text-sm text-gray-600">Score: {personalizedOverview.matchScore}/100</p>
                        </div>
                    ) : (
                        <div className="w-full">
                            <h4 className="text-lg font-semibold mb-2">Health Score</h4>
                            <Progress value={product.healthScore} className="w-full h-4" />
                            <p className="text-sm text-gray-600 mt-2">Score: {product.healthScore}/100</p>
                        </div>
                    )
                }
            </CardFooter>
        </Card>
    )
}
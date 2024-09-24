import { getProductOverview } from "@/lib/products";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "@/components/ui/progress";

interface ProductOverviewProps {
    productId: number;
}

interface NutritionalFacts {
    protein: number | null;
    saturatedFat: number | null;
    dietaryFiber: number | null;
    addedSugars: number | null;
    totalFat: number | null;
    totalCarbohydrate: number | null;
}

interface Ingredient {
    ingredient: {
        name: string;
    };
}

interface Product {
    summary: string;
    nutritionalFacts: NutritionalFacts | null;
    ingredients: Ingredient[];
}

export default async function ProductOverview({
    productId
}: ProductOverviewProps) {
    const product = await getProductOverview(productId);
    if (!product) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm mb-6">{product!.summary}</p>
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
            </CardContent>
            <CardFooter>
                <div className="w-full">
                    <h4 className="text-lg font-semibold mb-2">Health Score</h4>
                    <Progress value={product.healthScore} className="w-full h-4" />
                    <p className="text-sm text-gray-600 mt-2">Score: {product.healthScore}/10</p>
                </div>
            </CardFooter>
        </Card>
    )
}
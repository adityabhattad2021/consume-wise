// Implement a system to score a product.

type NutritionalFactWithoutId = {
  calories?: number;
  totalFat?: number;
  saturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  totalCarbohydrate?: number;
  dietaryFiber?: number;
  totalSugars?: number;
  addedSugars?: number;
  protein?: number;
  vitaminA?: number;
  vitaminC?: number;
  calcium?: number;
  iron?: number;
};

export function calculateNutrientDensity(nutritionalFact: NutritionalFactWithoutId | null): number {
  if (!nutritionalFact) return 0;

  const totalNutrients =
    (nutritionalFact.protein || 0) +
    (nutritionalFact.dietaryFiber || 0) +
    (nutritionalFact.vitaminA || 0) +
    (nutritionalFact.vitaminC || 0) +
    (nutritionalFact.calcium || 0) +
    (nutritionalFact.iron || 0);

  return nutritionalFact.calories ? (totalNutrients / nutritionalFact.calories * 100) : 0;
}

export function calculateNegativeNutrientScore(nutritionalFact: NutritionalFactWithoutId | null): number {
  if (!nutritionalFact) return 0;

  // For now just taking very average values for daily recommended intake.
  // All values are in standard units.

  const negativeScore =
    ((nutritionalFact.saturatedFat || 0) / 20) * 100 +
    ((nutritionalFact.transFat || 0) / 2) * 100 +
    ((nutritionalFact.cholesterol || 0) / 300) * 100 +
    ((nutritionalFact.sodium || 0) / 2300) * 100 +
    ((nutritionalFact.addedSugars || 0) / 50) * 100;

  return Math.max(0, 100 - negativeScore);
}

export function calculatePositiveNutrientScore(nutritionalFact: NutritionalFactWithoutId | null): number {
  if (!nutritionalFact) return 0;

  // For now just taking very average values for daily recommended intake.
  // All values are in standard units.
  const positiveScore =
    ((nutritionalFact.protein || 0) / 50) * 100 +
    ((nutritionalFact.dietaryFiber || 0) / 28) * 100 +
    ((nutritionalFact.vitaminA || 0) / 100) * 100 +
    ((nutritionalFact.vitaminC || 0) / 100) * 100 +
    ((nutritionalFact.calcium || 0) / 100) * 100 +
    ((nutritionalFact.iron || 0) / 100) * 100;

  return Math.min(positiveScore, 100);
}

export function calculateIngredientQualityScore(naturalIngredientCount: number, processedIngredientCount: number): number {
  const totalIngredients = naturalIngredientCount + processedIngredientCount;
  if (totalIngredients === 0) return 0;

  return Math.max(0, Math.min(100, (naturalIngredientCount / totalIngredients * 100) - (processedIngredientCount / totalIngredients * 50)));
}

export function calculateProductHealthScore(nutritionalFacts: NutritionalFactWithoutId | null, naturalIngredientCount: number, processedIngredientCount: number): number {
  const nutrientDensity = calculateNutrientDensity(nutritionalFacts);
  const negativeNutrientScore = calculateNegativeNutrientScore(nutritionalFacts);
  const positiveNutrientScore = calculatePositiveNutrientScore(nutritionalFacts);
  const ingredientQualityScore = calculateIngredientQualityScore(naturalIngredientCount, processedIngredientCount);

  const weightedScore = (
    nutrientDensity * 0.2 +
    negativeNutrientScore * 0.4 +
    positiveNutrientScore * 0.2 +
    ingredientQualityScore * 0.4
  );

  const transformedScore = Math.pow(weightedScore / 100, 0.7) * 100;

  return  Math.round(transformedScore * 10) / 10;
}


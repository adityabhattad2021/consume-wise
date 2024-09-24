// Implement a system to score a product.

import { ActivityLevel, BiologicalSex, HealthGoal } from "@prisma/client";

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

  return Math.round(transformedScore * 10) / 10;
}

/**
 * It uses Harris-Benedict formula (which takes into account weight, height, age and sex).
 */
export function calculateDailyCalorieNeeds(
  biologicalSex: BiologicalSex,
  weight: number,  // in kg
  height: number,  // in cm
  age: number,
  activityLevel: ActivityLevel,
  goals: HealthGoal[]
): number {
  let bmr: number;
  if (biologicalSex === BiologicalSex.MALE) {
    bmr = 66 + (9.6 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 655 + (13.7 * weight) + (5 * height) - (6.8 * age);
  }

  let activityMultiplier;
  switch (activityLevel) {
    case ActivityLevel.SEDENTARY:
      activityMultiplier = 1.2;
      break;
    case ActivityLevel.LIGHTLY_ACTIVE:
      activityMultiplier = 1.375;
      break;
    case ActivityLevel.MODERATELY_ACTIVE:
      activityMultiplier = 1.55;
      break;
    case ActivityLevel.VERY_ACTIVE:
      activityMultiplier = 1.725;
      break;
    case ActivityLevel.EXTREMELY_ACTIVE:
      activityMultiplier = 1.9;
      break;
    default:
      activityMultiplier = 0;
      break;
  }

  const tdee = bmr * activityMultiplier;

  let extraCal = 0;
  if (goals.includes(HealthGoal.WEIGHT_GAIN)) {
    extraCal = 300
  } else if (goals.includes(HealthGoal.WEIGHT_LOSS)) {
    extraCal = -400;
  }

  return Math.round(tdee + extraCal);
}

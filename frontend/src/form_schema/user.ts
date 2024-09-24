import { z } from "zod";

export const BiologicalSex = z.enum(["MALE", "FEMALE"]);

export const HealthDetail = z.enum([
    "NORMAL",
    "UNDERWEIGHT",
    "OVERWEIGHT",
    "OBESE",
    "DIABETES",
    "HYPERTENSION",
    "CARDIOVASCULAR",
    "RESPIRATORY",
    "DIGESTIVE",
    "ALLERGIES",
    "THYROID",
    "ARTHRITIS"
]);

export const ActivityLevel = z.enum([

    "SEDENTARY",
    "LIGHTLY_ACTIVE",
    "MODERATELY_ACTIVE",
    "VERY_ACTIVE",
    "EXTREMELY_ACTIVE"
]);

export const DietaryPreference = z.enum([
   
    "EGGITARIAN",
    "VEGETARIAN",
    "VEGAN"
]);

export const HealthGoal = z.enum([
    "HEALTH_BOOST",
    "WEIGHT_LOSS",
    "WEIGHT_GAIN",
    "MUSCLE_GAIN",
    "LESS_SUGAR",
    "CARDIO_CARE",
    "BETTER_SLEEP",
    "STRESS_REDUCTION",
    "IMPROVED_DIGESTION",
    "INCREASED_ENERGY"
]);


export const userFormSchema = z.object({
    biologicalSex: BiologicalSex,
    age: z.string(),
    weight: z.string(),
    height: z.string(),
    healthDetails: z.array(HealthDetail).default([HealthDetail.enum.NORMAL]),
    activityLevel: ActivityLevel,
    dietaryPreference: DietaryPreference,
    nutritionKnowledge: z.string(),
    healthGoals: z.array(HealthGoal).min(1),
});

export type UserFormData = z.infer<typeof userFormSchema>;
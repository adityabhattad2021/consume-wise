import {z} from "zod";

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


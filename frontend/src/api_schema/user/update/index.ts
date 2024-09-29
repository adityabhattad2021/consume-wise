import { z } from "zod";
import { BiologicalSex, HealthDetail, ActivityLevel, DietaryPreference, HealthGoal } from "@/api_schema/user/common";


export const updateUserSchema = z.object({
    biologicalSex: BiologicalSex.optional(),
    age: z.string().optional(),
    weight: z.string().optional(),
    height: z.string().optional(),
    healthDetails: z.array(HealthDetail).optional(),
    activityLevel: ActivityLevel.optional(),
    dietaryPreference: DietaryPreference.optional(),
    nutritionKnowledge: z.string().optional(),
    healthGoals: z.array(HealthGoal).optional(),
});

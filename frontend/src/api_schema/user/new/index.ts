import { z } from "zod";
import { BiologicalSex, HealthDetail, ActivityLevel, DietaryPreference, HealthGoal } from "@/api_schema/user/common";


export const newUserSchme = z.object({
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

export type UserFormData = z.infer<typeof newUserSchme>;
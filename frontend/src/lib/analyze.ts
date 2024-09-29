import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ConsumptionReport {
    totalConsumedCalories: number;
    totalConsumedProducts: number;
    reportDate: Date;
    majorCategories: string[];
    totalNutrients: AnalysisNutrientData;
}

export interface AnalysisNutrientData {
    calories: number;
    totalFat: number;
    saturatedFat: number;
    transFat: number;
    cholesterol: number;
    sodium: number;
    totalCarbohydrate: number;
    dietaryFiber: number;
    totalSugars: number;
    addedSugars: number;
    protein: number;
    vitaminA: number;
    vitaminC: number;
    calcium: number;
    iron: number;
}

export const recommendationType = {
    FOOD_SWAP: "Food Swap",
    PORTION_ADJUSTMENT: "Portion Adjustment",
    MEAL_PLAN_RECOMMENDATION: "Meal Plan Recommendation",
    NUTRIENT_INTAKE_ADJUSTMENT: "Nutrient Intake Adjustment"
}

export interface AnalysisRecommendation {
    type: typeof recommendationType[keyof typeof recommendationType];
    description: string;
    reason: string;
}

export interface AIAnalysis {
    analysisSummary: string;
    recommendations: AnalysisRecommendation[];
}


export interface WeeklyConsumptionAnalysis {
    id: string;
    userId: string;
    totalConsumedCalories: number;
    totalConsumedProducts: number;
    majorCategories: string[];
    totalNutrients: AnalysisNutrientData;
    aiAnalysis: string;
}

export async function analyzeUserConsumption(userId: string): Promise<undefined> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            console.error("User not found");
            return;
        }

        const consumptions = await prisma.consumption.findMany({
            where: {
                userId: userId,
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lt: new Date(new Date().setHours(23, 59, 59, 999))
                }
            },
            include: {
                product: {
                    select: {
                        categories: {
                            select:{
                                category: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        },
                        nutritionalFacts: {
                            select: {
                                calories: true,
                                totalFat: true,
                                saturatedFat: true,
                                transFat: true,
                                cholesterol: true,
                                sodium: true,
                                totalCarbohydrate: true,
                                dietaryFiber: true,
                                totalSugars: true,
                                addedSugars: true,
                                protein: true,
                                vitaminA: true,
                                vitaminC: true,
                                calcium: true,
                                iron: true
                            }
                        }
                    }
                }
            }
        })

        if (!consumptions || consumptions.length === 0) {
            console.error("No consumptions found");
            return;
        }

        const report: ConsumptionReport = {
            totalConsumedCalories: 0,
            totalConsumedProducts: 0,
            majorCategories: [],
            reportDate: new Date(),
            totalNutrients: {
                calories: 0,
                totalFat: 0,
                saturatedFat: 0,
                transFat: 0,
                cholesterol: 0,
                sodium: 0,
                totalCarbohydrate: 0,
                dietaryFiber: 0,
                totalSugars: 0,
                addedSugars: 0,
                protein: 0,
                vitaminA: 0,
                vitaminC: 0,
                calcium: 0,
                iron: 0
            }
        }

        for (const consumption of consumptions) {

            if (!consumption.product || !consumption.product.nutritionalFacts?.calories) {
                continue
            }

            report.majorCategories.push(...consumption.product.categories.map(category => category.category.name))

            Object.entries(consumption.product.nutritionalFacts).forEach(([key, value]) => {
                if (value) {
                    report.totalNutrients[key as keyof AnalysisNutrientData] += value * consumption.quantity
                }
            })

            report.totalConsumedCalories += consumption.product.nutritionalFacts.calories * consumption.quantity
            report.totalConsumedProducts += 1

        }

        const cleanedUserHealthDetails = {
            biologicalSex: user.biologicalSex,
            age: user.age,
            weight: user.weight,
            height: user.height,
            activityLevel: user.activityLevel,
            dietaryPreference: user.dietaryPreference,
            nutritionKnowledge: user.nutritionKnowledge,
            healthGoals: user.healthGoals,
            healthDetails: user.healthDetails,
            dailyCalorieNeeds: user.dailyCalorieNeeds
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
            Given the following user health details: ${JSON.stringify(cleanedUserHealthDetails)}
            and the following consumption report for the past week: ${JSON.stringify(report)}

            The output should be as personalized as possible.

            Analyze the user's consumption habits with the goal of identifying areas for improvement in their diet to achieve their goals. 
            Here is the format of the response:
            {
                "analysisSummary": "A concise summary of the user's consumption habits and areas for improvement.",
                "recommendations": [
                    { "type": "Food Swap", "description": "Swap [current food] for [recommended food]", "reason": "This will help [reason, e.g., reduce calorie intake, increase protein intake]" },
                    { "type": "Portion Adjustment", "description": "Reduce/Increase portion size of [food] by [amount]", "reason": "This will help [reason, e.g., reduce calorie intake, increase fiber intake]" },
                    // ... more recommendations 
                ]
            }
        `

        const response = await model.generateContent([prompt]);
        const text = response.response.text();
        console.log("Gemini Response:", text);
        const aiAnalysis: AIAnalysis = JSON.parse(text);

        await prisma.weeklyConsumptionAnalysis.create({
            data: {
                userId: userId,
                totalConsumedCalories: report.totalConsumedCalories,
                totalConsumedProducts: report.totalConsumedProducts,
                majorCategories: report.majorCategories,
                totalNutrients: JSON.stringify(report.totalNutrients),
                aiAnalysis: JSON.stringify(aiAnalysis)
            }
        })

    } catch (e) {
        console.error("Error generating or parsing analysis:", e);
        return;
    }
}


analyzeUserConsumption("cm1m5n22v000028fd1ej56bw5").then(() => {
    console.log("done");
}).catch((error) => {
    console.error(error);
})
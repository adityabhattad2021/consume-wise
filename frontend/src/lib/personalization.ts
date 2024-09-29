import { HealthDetail, type Allergen, type Category, type Ingredient, type NutritionalFact, type Product, type User } from "@prisma/client";
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from "@/lib/prisma";
import { InputJsonValue } from "@prisma/client/runtime/library";


type ProductWithRelations = Product & {
    categories: { category: Partial<Category> }[];
    nutritionalFacts: Partial<NutritionalFact> | null;
    ingredients: { ingredient: Partial<Ingredient> }[];
    allergens: Partial<Allergen>[];
    suitableFor: HealthDetail[];
    notSuitableFor: HealthDetail[];
};

export interface PersonalizedOverview {
    overview: string;
    matchScore: number;
    suitabilityReasons: { type: 'good' | 'bad'; reason: string }[];
    safeConsumptionGuideline: {
        frequency: 'daily' | 'weekly' | 'monthly';
        amount: number;
        unit: string;
    };
    healthGoalImpacts: { goal: string; impact: string }[];
    nutrientHighlights: { nutrient: string; benefit: string }[];
}

async function fetchAllData(userId: string, productId: number): Promise<{ user: Partial<User>; product: Partial<ProductWithRelations> }> {
    const userPromise = prisma.user.findUnique({
        where: { id: userId },
        select: {
            healthDetails: true,
            dietaryPreference: true,
            healthGoals: true,
            nutritionKnowledge: true,
            dailyCalorieNeeds: true
        }
    });

    const productPromise = prisma.product.findUnique({
        where: { id: productId },
        select: {
            name: true,
            brand: true,
            categories: {
                select: {
                    category: {
                        select: { name: true }
                    }
                }
            },
            servingSize: true,
            servingUnit: true,
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
            },
            ingredients: {
                select: {
                    ingredient: {
                        select: { name: true }
                    }
                }
            },
            suitableFor: true,
            notSuitableFor: true,
            nutritionDensity: true,
            healthScore: true,
            functionalBenefits: true
        }
    });

    const [user, product] = await Promise.all([userPromise, productPromise]);
    return { user: user || {}, product: product || {} };
}

function generateCombinedPrompt(user: Partial<User>, product: Partial<ProductWithRelations>): string {
    return `
    Given the following user profile and product details, generate a personalized product overview, match score, suitability reasons, safe consumption guideline, health goal impacts, and nutrient highlights.  Return the results as a JSON object with the following structure:
    {
        "overview": "string",
        "matchScore": number, (0-100)
        "suitabilityReasons": [{ "type": "good/bad", "reason": "string" }],
        "safeConsumptionGuideline": { "frequency": "daily/weekly/monthly", "amount": number, "unit": "string" },
        "healthGoalImpacts": [{ "goal": "string", "impact": "string" }],
        "nutrientHighlights": [{ "nutrient": "string", "benefit": "string" }]
    }

    User: ${JSON.stringify(user)}
    Product: ${JSON.stringify(product)}

    Be as detailed and specific as possible in your responses, especially regarding suitability reasons, safe consumption guidelines, and health goal impacts. Consider the user's health details, dietary preferences, health goals, and nutrition knowledge when generating the personalized information.  If the user has limited nutritional knowledge, explain concepts in simple terms. If the product is unsuitable due to allergies or health conditions, clearly state the reasons and provide specific alternatives or recommendations if possibl0e.
    Use personalized tone in the response, user should feel like the response is written for them specifically.

    Aim to provide a comprehensive, personalized, and actionable analysis that helps the user make an informed decision about the product while considering their unique health profile and goals.
    `;
}


export async function getCompleteProductInsights(userId: string, productId: number): Promise<PersonalizedOverview | null> {

    const cachedData = await prisma.personalizedOverview.findUnique({
        where: {
            userId_productId: {
                userId: userId,
                productId: productId
            }
        },
        select:{
            overview:true,
            matchScore:true,
            suitabilityReasons:true,
            safeConsumptionGuideline:true,
            healthGoalImpacts:true,
            nutrientHighlights:true
        }
    });

    if (cachedData) {
        try {
            return cachedData as PersonalizedOverview;
        } catch (e) {
            console.error("Error parsing cached data:", e);
        }
    }

    const { user, product } = await fetchAllData(userId, productId);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-002",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = generateCombinedPrompt(user, product);

    try {
        const response = await model.generateContent([prompt]);
        const text = response.response.text();
        console.log("Gemini Response:", text);

        const parsedResponse = JSON.parse(text) as PersonalizedOverview;

        await prisma.personalizedOverview.create({
            data: {
                overview:parsedResponse.overview,
                matchScore:parsedResponse.matchScore,
                suitabilityReasons:parsedResponse.suitabilityReasons,
                safeConsumptionGuideline:parsedResponse.safeConsumptionGuideline as unknown as InputJsonValue,
                healthGoalImpacts:parsedResponse.healthGoalImpacts,
                nutrientHighlights:parsedResponse.nutrientHighlights,
                user: { connect: { id: userId } },
                product: { connect: { id: productId } }
            }
        });

        return parsedResponse;

    } catch (e) {
        console.error("Error generating or parsing insights:", e);
        return null;
    }
}
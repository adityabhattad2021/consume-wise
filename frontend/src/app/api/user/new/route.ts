import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { type Session } from "next-auth";
import { calculateDailyCalorieNeeds } from "@/lib/scores";
import { newUserSchme } from "@/api_schema/user/new";

interface NextAuthRequest extends NextRequest {
    auth: Session | null;
  }
export const POST = auth(async function POST(req: NextAuthRequest) {
    try {
        if (!req.auth) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
        }
        const user = await prisma.user.findUnique({
            where:{
                id:req.auth.user.id
            }
        })
        if(!user){
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }
        if(user.isOnboarded){
            return NextResponse.json({ message: "User already on boarded" }, { status: 400 })
        }
        const rawData = await req.json();
        
        const validationResult = newUserSchme.safeParse(rawData);

        if (!validationResult.success) {
            return NextResponse.json({ message: "Invalid data", errors: validationResult.error.errors }, { status: 400 });
        }

        const data = validationResult.data;

        
        const transformedData = {
            biologicalSex: data.biologicalSex,
            age: parseInt(data.age),
            weight: parseFloat(data.weight),
            height: parseFloat(data.height),
            healthDetails: data.healthDetails,
            activityLevel: data.activityLevel,
            dietaryPreference: data.dietaryPreference,
            nutritionKnowledge: parseInt(data.nutritionKnowledge),
            healthGoals: data.healthGoals,
            isOnboarded: true
        };

        const dailyCalNeeds = calculateDailyCalorieNeeds(transformedData.biologicalSex,transformedData.weight,transformedData.height,transformedData.age,data.activityLevel,transformedData.healthGoals);

        await prisma.user.update({
            where: {
                id: req.auth.user.id
            },
            data: {
                ...transformedData,
                dailyCalorieNeeds:dailyCalNeeds
            }
        });

        return NextResponse.json({ message: 'Success', status: 200 })
    } catch (err) {
        console.log('[ONBOARD_USER_ERROR]: ', err);
    }
})

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { type Session } from "next-auth";
import { BiologicalSex, HealthDetail, ActivityLevel, DietaryPreference, HealthGoal } from "@/form_schema/user";
import { z } from "zod";
import { revalidatePath } from "next/cache";


interface NextAuthRequest extends NextRequest {
    auth: Session | null;
}

 const userSchema = z.object({
    biologicalSex: BiologicalSex.optional(),
    age: z.number().optional(),
    weight: z.string().optional(),
    height: z.string().optional(),
    healthDetails: z.array(HealthDetail).optional(),
    activityLevel: ActivityLevel.optional(),
    dietaryPreference: DietaryPreference.optional(),
    nutritionKnowledge: z.string().optional(),
    healthGoals: z.array(HealthGoal).optional(),
});

export const POST = auth(async function POST(req:NextAuthRequest){
    try{
        if(!req.auth){
            return NextResponse.json({message:"Not authenticated"},{status:401})
        }
        
        const rawData = await req.json();

        const validationResult = userSchema.safeParse(rawData);

        if(!validationResult.success){
            return NextResponse.json({message:"Invalid data",errors:validationResult.error.errors},{status:400})
        }


        const data = validationResult.data;
        
        const transformedData: any = {};

        const fieldsToUpdate = [
            'biologicalSex',
            'age',
            'weight',
            'height',
            'healthDetails',
            'activityLevel',
            'dietaryPreference',
            'nutritionKnowledge',
            'healthGoals'
        ];

        fieldsToUpdate.forEach(field => {
            if (data[field as keyof typeof data] !== undefined) {
                transformedData[field] = field === 'weight' || field === 'height' ? parseFloat(data[field as keyof typeof data] as string) : field === 'nutritionKnowledge' ? parseInt(data[field as keyof typeof data] as string) : data[field as keyof typeof data];
            }
        });

        console.log(transformedData);

        await prisma.user.update({
            where:{
                id:req.auth.user.id
            },
            data:transformedData
        })
        revalidatePath('/profile');
        return NextResponse.json({message:"User updated successfully"},{status:200})
    }catch(err){
        console.log(`[ERROR_WHILE_UPDATING]: `,err);
        return NextResponse.json({message:"Internal server error"},{status:500})
    }
})
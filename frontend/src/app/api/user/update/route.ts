import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { type Session } from "next-auth";
import { revalidateTag } from "next/cache";
import { updateUserSchema } from "@/api_schema/user/update";


interface NextAuthRequest extends NextRequest {
    auth: Session | null;
}


export const POST = auth(async function POST(req:NextAuthRequest){
    try{
        if(!req.auth){
            return NextResponse.json({message:"Not authenticated"},{status:401})
        }
        
        const rawData = await req.json();

        const validationResult = updateUserSchema.safeParse(rawData);

        if(!validationResult.success){
            return NextResponse.json({message:"Invalid data",errors:validationResult.error.errors},{status:400})
        }


        const data = validationResult.data;
        
        const transformedData = {};

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
                // @ts-expect-error Don't know how to properly type this
                transformedData[field] = field === 'weight' || field === 'height' ? parseFloat(data[field as keyof typeof data] as string) : field === 'nutritionKnowledge' || field === 'age' ? parseInt(data[field as keyof typeof data] as string) : data[field as keyof typeof data];
            }
        });

        console.log(transformedData);
        await prisma.user.update({
            where: {
                id:req.auth.user.id
            },
            data:transformedData
        })
        revalidateTag('user')
        return NextResponse.json({message:"User updated successfully"},{status:200})
    }catch(err){
        console.log(`[ERROR_WHILE_UPDATING]: `,err);
        return NextResponse.json({message:"Internal server error"},{status:500})
    }
})
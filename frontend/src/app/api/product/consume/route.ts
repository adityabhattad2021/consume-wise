import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { type Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { consumeProductSchema } from "@/api_schema/product/consume";


interface NextAuthRequest extends NextRequest {
    auth: Session | null;
}


export const POST = auth(async function POST(req:NextAuthRequest){
    try{
        if(!req.auth){
            return NextResponse.json({message:"Not authenticated"},{status:401})
        }

        const rawData = await req.json();

        const validationResult = consumeProductSchema.safeParse(rawData);

        if(!validationResult.success){
            return NextResponse.json({message:"Invalid data",errors:validationResult.error.errors},{status:400})
        }

        const data = validationResult.data;

        const user = await prisma.user.findUnique({
            where:{
                id:req.auth.user.id
            }
        })

        if(!user){
            return NextResponse.json({message:"User not found"},{status:404})
        }

        const transformedData = {
            productId:data.productId,
            quantity:parseInt(data.quantity),
            duration:parseInt(data.duration),
            userId:user.id
        }

        await prisma.consumption.create({
            data:{
                ...transformedData,
            }
        })

        return NextResponse.json({message:"Consumption logged successfully"},{status:200})
    }catch(error){
        console.log('[PRODUCT_CONSUME_ERROR]: ',error)
        return NextResponse.json({message:"Internal server error"},{status:500})
    }
})
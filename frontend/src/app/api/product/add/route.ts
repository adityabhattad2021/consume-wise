import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { type Session } from "next-auth";
import { scrapeAndStoreProduct } from "@/lib/scraper";
import { addProductSchema } from "@/api_schema/product/add";

export const maxDuration = 60;

interface NextAuthRequest extends NextRequest {
    auth: Session | null;
}

export const POST = auth(async function POST(req: NextAuthRequest) {
    try {
        // Add rate limiting for every 1 
        if (!req.auth) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
        }
        
        const data = await req.json();

        const validationResult = addProductSchema.safeParse(data);
        if(!validationResult.success){
            return NextResponse.json({ message: validationResult.error.message }, { status: 400 });
        }
        const {url} = validationResult.data;

        await scrapeAndStoreProduct(url);
        return NextResponse.json({ message: "Product added successfully" }, { status: 200 });
    }
    catch(err:any){
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
});
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { type Session } from "next-auth";
import { scrapeAndStoreProduct } from "@/lib/scraper";

interface NextAuthRequest extends NextRequest {
    auth: Session | null;
}

export const POST = auth(async function POST(req: NextAuthRequest) {
    try {
        // Add rate limiting for every 1 hr
        if (!req.auth) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
        }
        
        const {url} = await req.json();
        const result = await scrapeAndStoreProduct(url);
        return NextResponse.json({ message: result }, { status: 200 });
    }
    catch(err){
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
});
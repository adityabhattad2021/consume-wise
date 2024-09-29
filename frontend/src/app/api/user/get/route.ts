import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { type Session } from "next-auth";

interface NextAuthRequest extends NextRequest {
    auth: Session | null;
}

export const GET = auth(async function GET(req: NextAuthRequest) {
    try {
        if (!req.auth) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.auth.user.id
            }
        });

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
});

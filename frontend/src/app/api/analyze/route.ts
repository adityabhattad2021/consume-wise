import { analyzeUserConsumption } from "@/lib/analyze";
import prisma from "@/lib/prisma";

export const maxDuration = 40;

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response("Unauthorized", { status: 401 });
        }
        const users = await prisma.user.findMany();
        for (const user of users) {
            await analyzeUserConsumption(user.id);
        }
        return Response.json({ success: true });
    } catch (err) {
        console.log('[ANALYZE_USER]: ',err);
        
        return Response.json({ status: 500 })
    }

}
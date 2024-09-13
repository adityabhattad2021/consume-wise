"use server";
import prisma from "@/lib/prisma";
import { type Category } from "@prisma/client";

export async function getCategories(): Promise<Category[]> {
    const categories = await prisma.category.findMany();
    return categories;
}


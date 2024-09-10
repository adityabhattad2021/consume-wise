"use server"
import prisma from "@/lib/prisma"
import { Product } from "@prisma/client";

export async function getProducts() {
    const products = await prisma.product.findMany({
        select: {
            name: true,
            imageUrl: true,
            brand: true,
            id: true
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return products
}

export type DetailedProduct = Product & {
    categories: { category: { name: string } }[]
    nutritionalFacts: {
      calories: number | null
      totalFat: number | null
      saturatedFat: number | null
      transFat: number | null
      cholesterol: number | null
      sodium: number | null
      totalCarbohydrate: number | null
      dietaryFiber: number | null
      totalSugars: number | null
      addedSugars: number | null
      protein: number | null
      vitaminA: number | null
      vitaminC: number | null
      calcium: number | null
      iron: number | null
    } | null
    ingredients: {
      ingredient: {
        name: string
        description: string | null
        commonUses: string | null
        potentialRisks: string | null
      }
      effects: {
        effectType: string | null
        description: string | null
        scientificEvidence: string | null
        severity: string | null
        duration: string | null
      }[]
    }[]
    claims: {
      claim: string
      verificationStatus: string | null
      explanation: string | null
      source: string | null
    }[]
    allergens: { allergen: { name: string } }[]
  }
  
  export async function getProduct(id: number): Promise<DetailedProduct | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        nutritionalFacts: true,
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        claims: true,
        allergens: {
          include: {
            allergen: true,
          },
        },
      },
    })
  
    if (!product) return null
  
    const detailedProduct: DetailedProduct = {
      ...product,
      ingredients: await Promise.all(
        product.ingredients.map(async (pi) => ({
          ...pi,
          effects: await prisma.ingredientEffect.findMany({
            where: { ingredientId: pi.ingredient.id },
          }),
        }))
      ),
    }
  
    return detailedProduct
  }
"use server"
import prisma from "@/lib/prisma"
import { type Product } from "@prisma/client";

export async function getProducts(categories: string[]) {
  const categoryIds = categories.map(id => Number(id));
  const products = await prisma.product.findMany({
    where: categories.length > 0 ? {
      categories: {
        some: {
          category: {
            id: {
              in: categoryIds
            }
          }
        }
      }
    } : undefined,
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


export async function getProductBasicInfo(id: number) {
  return await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      brand: true,
      imageUrl: true,
      summary: true,
      servingSize: true,
      servingUnit: true,
    },
  });
}

export async function getProductOverview(id: number) {
  return prisma.product.findUnique({
    where: { id },
    select: {
      summary: true,
      nutritionalFacts: {
        select: {
          protein: true,
          totalFat: true,
          totalCarbohydrate: true,
          saturatedFat:true,
          addedSugars:true,
          dietaryFiber: true,
        },
      },
      ingredients: {
        select: {
          ingredient: {
            select: { name: true },
          },
        },
        take: 5,
      },
    },
  })
}

export async function getProductCategories(id: number) {
  return await prisma.productCategory.findMany({
    where: { productId: id },
    include: { category: true },
  });
}

export async function getProductNutrition(id: number) {
  return prisma.product.findUnique({
    where: { id },
    select: {
      servingSize: true,
      servingUnit: true,
      nutritionalFacts: true,
    },
  })
}

export async function getProductIngredients(productId: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        ingredients: {
          include: {
            ingredient: {
              include: {
                effects: true,
              },
            },
          },
          orderBy: {
            orderNumber: 'asc',
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    // Restructure the data to match the component's expected format
    const formattedProduct = {
      ...product,
      ingredients: product.ingredients.map((productIngredient) => ({
        ...productIngredient.ingredient,
        effects: productIngredient.ingredient.effects,
      })),
    };

    return formattedProduct;
  } catch (error) {
    console.error('Error fetching product ingredients:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getProductClaims(id: number) {
  return await prisma.productClaim.findMany({
    where: { productId: id },
  });
}

export async function getProductAllergens(id: number) {
  return await prisma.productAllergen.findMany({
    where: { productId: id },
    include: { allergen: true },
  });
}
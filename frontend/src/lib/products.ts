"use server"
import prisma from "@/lib/prisma"


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

export async function getProductBasicInfo(id: number) {
  return await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      brand: true,
      imageUrl: true,
      summary: true,
      vendorProductUrl: true,
      venderName: true,
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
      healthScore:true,
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
import prisma from "@/lib/prisma"

export async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
    const products = await prisma.product.findMany({
        select: {
            name: true,
            imageUrl:true,
            brand:true,
            id:true
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return products
}
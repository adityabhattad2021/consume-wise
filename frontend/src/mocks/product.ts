import { HealthDetail, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker"
const prisma = new PrismaClient();

const NUM_PRODUCTS = 50;
const NUM_CATEGORIES = 10;
const NUM_INGREDIENTS = 20;

const allergensList: string[] = [
    "Milk",
    "Peanuts",
    "Tree nuts (almonds, cashews, walnuts)",
    "Wheat",
    "Soy",
    "Eggs",
    "Fish",
    "Shellfish (shrimp, crab, lobster)",
    "Sesame",
    "Mustard",
    "Chickpeas",
    "Lentils",
    "Corn",
    "Coconut",
    "Garlic",
    "Onion",
    "Mango",
    "Kiwi",
    "Banana",
    "Sulfites (used as preservatives)"
];


async function main(): Promise<void> {

    const categoriesData = Array.from({ length: NUM_CATEGORIES }, () => ({
        name: faker.food.adjective()
    }));

    await prisma.category.createMany({
        data: categoriesData,
        skipDuplicates: true
    });
    const categories = await prisma.category.findMany();

    const allergensData = allergensList.map(name => ({ name }));

    await prisma.allergen.createMany({
        data: allergensData,
        skipDuplicates: true
    });
    const allergens = await prisma.allergen.findMany();

    const ingredients = await Promise.all(
        Array.from({ length: NUM_INGREDIENTS }, () =>
            prisma.ingredient.create({
                data: {
                    name: faker.food.ingredient(),
                    description: faker.food.description(),
                    commonUses: faker.lorem.sentence(),
                    potentialRisks: faker.lorem.sentence(),
                    effects: {
                        create: {
                            effectType: faker.helpers.arrayElement(['Positive', 'Negative', 'Neutral']),
                            description: faker.lorem.sentence(),
                            scientificEvidence: faker.lorem.sentence(),
                            severity: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
                            duration: faker.helpers.arrayElement(['Short-term', 'Long-term']),
                        },
                    },
                },
            })
        )
    );
    const suitableFor = faker.helpers.arrayElements(Object.values(HealthDetail), { min: 1, max: 3 });
    const notSuitableFor = faker.helpers.arrayElements(Object.values(HealthDetail).filter(detail => !suitableFor.includes(detail)), { min: 0, max: 2 });
    for (let i = 0; i < NUM_PRODUCTS; i++) {
        await prisma.product.create({
            data: {
                name: faker.commerce.productName(),
                brand: faker.company.name(),
                imageUrl: [faker.image.url(), faker.image.url()],
                servingSize: faker.number.float({ min: 1, max: 500, fractionDigits: 1 }),
                servingUnit: faker.helpers.arrayElement(['g', 'ml', 'oz', 'cup']),
                summary: faker.lorem.paragraph(),
                healthScore: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
                nutritionDensity: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
                functionalBenefits: faker.helpers.arrayElements(['Antioxidant', 'Probiotic', 'Omega-3', 'Fiber'], { min: 1, max: 3 }),
                suitableFor: suitableFor,
                notSuitableFor: notSuitableFor,
                categories: {
                    create: faker.helpers.arrayElements(categories, { min: 1, max: 3 }).map(category => ({
                        category: { connect: { id: category.id } }
                    }))
                },
                nutritionalFacts: {
                    create: {
                        calories: faker.number.float({ min: 0, max: 500, fractionDigits: 1 }),
                        totalFat: faker.number.float({ min: 0, max: 50, fractionDigits: 1 }),
                        saturatedFat: faker.number.float({ min: 0, max: 20, fractionDigits: 1 }),
                        transFat: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
                        cholesterol: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
                        sodium: faker.number.float({ min: 0, max: 1000, fractionDigits: 1 }),
                        totalCarbohydrate: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
                        dietaryFiber: faker.number.float({ min: 0, max: 20, fractionDigits: 1 }),
                        totalSugars: faker.number.float({ min: 0, max: 50, fractionDigits: 1 }),
                        addedSugars: faker.number.float({ min: 0, max: 25, fractionDigits: 1 }),
                        protein: faker.number.float({ min: 0, max: 50, fractionDigits: 1 }),
                        vitaminA: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
                        vitaminC: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
                        calcium: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
                        iron: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
                    }
                },
                ingredients: {
                    create: faker.helpers.arrayElements(ingredients, { min: 3, max: 10 }).map((ingredient, index) => ({
                        ingredient: { connect: { id: ingredient.id } },
                        orderNumber: index + 1
                    }))
                },
                claims: {
                    create: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
                        claim: faker.lorem.sentence(),
                        verificationStatus: faker.helpers.arrayElement(['Verified', 'Pending', 'Unverified']),
                        explanation: faker.lorem.paragraph(),
                        source: faker.internet.url(),
                    }))
                },
                allergens: {
                    create: faker.helpers.arrayElements(allergens, { min: 0, max: 3 }).map(allergen => ({
                        allergen: { connect: { id: allergen.id } }
                    }))
                },
            }
        });
    }

    console.log(`Created ${NUM_PRODUCTS} mock products with related data.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
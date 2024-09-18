import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { z } from "zod";

const client = new MongoClient(Bun.env.MONGODB_URI as string);

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004", // 768 dimensions
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
    apiKey: Bun.env.GOOGLE_API_KEY
});

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: Bun.env.GOOGLE_API_KEY,
    verbose: true,
});

const ProductSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    brand: z.string().min(1),
    categories: z.array(z.object({
        categoryId: z.string()
    })),
    servingSize: z.string().optional(),
    servingUnit: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    nutritionalFacts: z.object({
        calories: z.string().optional(),
        totalFat: z.string().optional(),
        saturatedFat: z.string().optional(),
        transFat: z.string().optional(),
        cholesterol: z.string().optional(),
        sodium: z.string().optional(),
        totalCarbohydrate: z.string().optional(),
        dietaryFiber: z.string().optional(),
        totalSugars: z.string().optional(),
        addedSugars: z.string().optional(),
        protein: z.string().optional(),
        vitaminA: z.string().optional(),
        vitaminC: z.string().optional(),
        calcium: z.string().optional(),
        iron: z.string().optional(),
    }).optional(),
    ingredients: z.array(z.object({
        name: z.string()
    })),
    claims: z.array(z.object({
        claim: z.string(),
        verificationStatus: z.string().optional(),
        explanation: z.string().optional(),
        source: z.string().optional()
    })),
    allergens: z.array(z.object({
        allergenId: z.string()
    })),
    summary: z.string()
});

type Product = z.infer<typeof ProductSchema>;

const parser = StructuredOutputParser.fromZodSchema(z.array(ProductSchema));

async function generateSyntheticData(): Promise<Product[]> {
    const prompt = `
You are a helpful assistant that generates product data. Generate 10 fictional product records. Each record should include the following fields:
- id
- name
- brand
- categories (array of objects with categoryId)
- servingSize
- servingUnit
- createdAt
- updatedAt
- nutritionalFacts (object with various nutritional values)
- ingredients (array of objects with name)
- claims (array of objects with claim, verificationStatus, explanation, source)
- allergens (array of objects with allergenId)
- summary

Ensure variety in the data and realistic values. All numeric values should be represented as strings.

${parser.getFormatInstructions()}
`;

    console.log('Generating synthetic data...');

    const response = await llm.invoke(prompt);
    return parser.parse(response.content as string);
}

async function seedDatabase(): Promise<void> {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const db = client.db("product_database");
        const collection = db.collection("products");

        await collection.deleteMany({});

        const syntheticData = await generateSyntheticData();

        const recordWithSummary = await Promise.all(
            syntheticData.map(async (record) => ({
                pageContent: record.summary,
                metadata: { ...record }
            }))
        );

        for (const record of recordWithSummary) {
            await MongoDBAtlasVectorSearch.fromDocuments(
                [record],
                embeddings,
                {
                    collection,
                    indexName: "vector_index",
                    textKey: "embedding_text",
                    embeddingKey: "embedding"
                }
            );
            console.log("Successfully processed & saved record:", record.metadata.name);
        }

        console.log("Database seeding completed");

    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        await client.close();
    }
}

seedDatabase().catch(console.error);
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);


interface Category {
    name: string;
}


export async function generateSeedCategories(): Promise<Category[]> {
    try{
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: { responseMimeType: 'application/json' }
        })
    
    
        const prompt = `Generate a list of 20 FMCG food and beverage product categories commonly found in the Indian market. These categories should be broad enough to cover a wide range of products that can be rated based on their health impact.
    
        Please provide the output as a JSON array of objects, where each object has a 'name' property representing the category name. The category name should be concise, preferably one or two words.
    
        Example format:
        [
            { "name": "DairyProducts" },
            { "name": "Snacks" },
            ...
        ]`;
    
        const result = await model.generateContent([prompt]);
        const response = result.response;
        const text = response.text();
        console.log(text);
        return JSON.parse(text) as Category[];
    }catch(err){
        console.log("Error while creating the categories",err);
        process.exit(1);
    }
    
}

async function storeSeedCategories(){
    try {
        const categories = await generateSeedCategories();
        const createdCategories  = await prisma.category.createMany({
            data:categories.map(category=>({name:category.name})),
            skipDuplicates:true,
        })
        console.log(`${createdCategories.count} categoires added to the database.`);
        console.log('Database seeded successfully.');
    } catch (error) {
        console.log('Error while seeding the database: ',error);
        process.exit(1);
    }
    
}

storeSeedCategories();
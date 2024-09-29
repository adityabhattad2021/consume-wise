import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { HealthDetail, PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import { calculateNutrientDensity, calculateProductHealthScore } from './scores';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

interface ProductDetails {
	name: string;
	brand: string;
	summary: string;
	categories: string[];
	servingSize?: number;
	servingUnit?: string;
	nutritionalFacts: {
		calories?: number;
		totalFat?: number;
		saturatedFat?: number;
		transFat?: number;
		cholesterol?: number;
		sodium?: number;
		totalCarbohydrate?: number;
		dietaryFiber?: number;
		totalSugars?: number;
		addedSugars?: number;
		protein?: number;
		vitaminA?: number;
		vitaminC?: number;
		calcium?: number;
		iron?: number;
	};
	ingredients: Array<{
		name: string;
		description?: string;
		commonUses?: string;
		potentialRisks?: string;
		effects: Array<{
			effectType?: string;
			description?: string;
			scientificEvidence?: string;
			severity?: string;
			duration?: string;
		}>;
	}>;
	claims: Array<{
		claim: string;
		verificationStatus?: string;
		explanation?: string;
		source?: string;
	}>;
	allergens: string[];
	functionalBenefits: string[];
	suitableFor: HealthDetail[]
	notSuitableFor: HealthDetail[];
	naturalIngredientCount: number;
	processedIngredientCount: number;
}

async function scrapeProductImages(url: string): Promise<string[]> {
	try {
		const response = await fetch(url);
		const html = await response.text();
		const dom = new JSDOM(html);
		const doc = dom.window.document;

		return extractHighQualityImages(doc);
	} catch (error) {
		console.error('Error scraping product images:', error);
		return [];
	}
}

function extractHighQualityImages(doc: Document): string[] {
	const imageUrls: string[] = [];

	const mainImage = doc.querySelector('.js-image-zoom__zoomed-image');
	if (mainImage) {
		const backgroundImage = mainImage.getAttribute('style');
		const match = backgroundImage?.match(/url$$"(.+?)"$$/);
		if (match && match[1]) {
			imageUrls.push(match[1]);
		}
	}

	const thumbnails = doc.querySelectorAll('.thumbnail img');
	thumbnails.forEach((img) => {
		const src = img.getAttribute('src');
		if (src) {
			const highQualityUrl = src.replace('/p/s/', '/p/l/').replace('?tr=w-256,q=80', '');
			if (!imageUrls.includes(highQualityUrl)) {
				imageUrls.push(highQualityUrl);
			}
		}
	});

	return imageUrls.filter(url =>
		url.startsWith('https://') &&
		!url.includes('data:image') &&
		!url.includes('data:image/svg+xml')
	);
}

async function analyzeProductWithGemini(imageUrls: string[]): Promise<ProductDetails> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

		const imageParts = await Promise.all(imageUrls.map(async (url) => {
			const response = await fetch(url);
			const arrayBuffer = await response.arrayBuffer();
			return {
				inlineData: {
					data: Buffer.from(arrayBuffer).toString('base64'),
					mimeType: 'image/jpeg'
				}
			};
		}));

		const availableCategories = await prisma.category.findMany({})
		const categoryArryString = `[${availableCategories.join(', ')}]`

		const prompt = `Imagine you're a nutrition expert browsing the grocery store. You've got a product in front of you – a package, a box, whatever it is. Let's analyze this product like you're helping a friend make a healthy choice. 

		**Here's what I need from you:**

		**Focus on the Facts:**  Pay close attention to the nutritional information and ingredient list.  Forget about fancy marketing – we're looking for the real deal. 
		**Tell me about the Ingredients:**  For each ingredient, give me a rundown on what it is, what it's typically used for, and any potential health effects.  Think about things like whether it's beneficial, if there are any risks to watch out for, and how long these effects might last.
		**Truth in Advertising:** Check out the claims on the packaging. Do they match up with the ingredients and the nutrition facts? Let me know if the claims are verified, unverified, or even misleading. 
		**Allergy Alert:** Are there any potential allergens listed on the package or that you can identify from the ingredients? 
		**Summarize It for Me:** Give me a quick summary of the product from a nutritionist's point of view. Keep it simple and clear so anyone can understand it. 
		**Complete the Picture:** Let's fill in all the information in the JSON structure. If something's missing, give me your best guess based on your expertise. 

		**Example Data Structure (JSON):**

		The JSON output must strictly conform to the following structure to be compatible with the database schema:

		{
		"name": "string",
		"brand": "string",
		"categories": string[],
		"servingSize": "number | null", 
		"servingUnit": "string | null",
		"nutritionalFacts": {
			"calories": "number | null",
			"totalFat": "number | null",
			"saturatedFat": "number | null",
			"transFat": "number | null",
			"cholesterol": "number | null",
			"sodium": "number | null",
			"totalCarbohydrate": "number | null",
			"dietaryFiber": "number | null",
			"totalSugars": "number | null",
			"addedSugars": "number | null",
			"protein": "number | null",
			"vitaminA": "number | null",
			"vitaminC": "number | null",
			"calcium": "number | null",
			"iron": "number | null"
		},
		"ingredients": [
			{
			"name": "string",
			"description": "string | null",
			"commonUses": "string | null",
			"potentialRisks": "string | null",
			"effects": [
				{
				"effectType": "string | null",
				"description": "string | null",
				"scientificEvidence": "string | null",
				"severity": "string | null",
				"duration": "string | null"
				}
			]
			}
		],
		"claims": [
			{
			"claim": "string",
			"verificationStatus": "string | null",
			"explanation": "string | null",
			"source": "string | null"
			}
		],
		"allergens": ["string"],
		"summary": "string",
		"functionalBenefits": ["string"],
		"suitableFor": ["string"],  Options: ${Object.values(HealthDetail)}
		"notSuitableFor": ["string"], Options: ${Object.values(HealthDetail)}
		"naturalIngredientCount": "number",
		"processedIngredientCount": "number"
		}

		**Available Categories:** ${categoryArryString}

		Analyze the product images thoroughly and provide a comprehensive, scientifically-sound analysis.  Prioritize accuracy and evidence-based reasoning over marketing claims. Ensure the JSON output strictly adheres to the specified structure for seamless integration with the database schema.
		`;

		const result = await model.generateContent([prompt, ...imageParts]);
		const response = result.response;
		const text = response.text();
		console.log(text);

		return JSON.parse(text) as ProductDetails;
	} catch (err) {
		console.log("error while analyzing data with gemini", err);
		process.exit(1)
	}

}


async function storeImagesInVercelBlob(imageUrls: string[]): Promise<string[]> {
	const storedUrls: string[] = [];

	for (const url of imageUrls) {
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const pngBuffer = await sharp(buffer).png().toBuffer();

		const { url: storedUrl } = await put(`product-${Date.now()}.png`, pngBuffer, { access: 'public' });
		storedUrls.push(storedUrl);
	}

	return storedUrls;
}

async function storeProductInDatabase(productDetails: ProductDetails, imageUrls: string[], url: string, venderName: string) {

	const categoryPromises = productDetails.categories.map(async (categoryName) => {
		return prisma.category.upsert({
			where: { name: categoryName },
			update: {},
			create: { name: categoryName },
		});
	});
	const categories = await Promise.all(categoryPromises);

	const product = await prisma.product.create({
		data: {
			name: productDetails.name,
			brand: productDetails.brand,
			venderName: venderName,
			vendorProductUrl: url,
			summary: productDetails.summary,
			imageUrl: imageUrls,
			servingSize: productDetails.servingSize,
			servingUnit: productDetails.servingUnit,
			nutritionalFacts: {
				create: productDetails.nutritionalFacts
			},
			healthScore: calculateProductHealthScore(productDetails.nutritionalFacts, productDetails.naturalIngredientCount, productDetails.processedIngredientCount),
			nutritionDensity: calculateNutrientDensity(productDetails.nutritionalFacts),
			ingredients: {
				create: productDetails.ingredients.map((ingredient, index) => ({
					ingredient: {
						connectOrCreate: {
							where: { name: ingredient.name },
							create: {
								name: ingredient.name,
								description: ingredient.description,
								commonUses: ingredient.commonUses,
								potentialRisks: ingredient.potentialRisks,
								effects: {
									create: ingredient.effects.map(effect => ({
										effectType: effect.effectType,
										description: effect.description,
										scientificEvidence: effect.scientificEvidence,
										severity: effect.severity,
										duration: effect.duration
									}))
								}
							}
						}
					},
					orderNumber: index + 1
				}))
			},
			claims: {
				create: productDetails.claims.map(claim => ({
					claim: claim.claim,
					verificationStatus: claim.verificationStatus,
					explanation: claim.explanation,
					source: claim.source
				}))
			},
			allergens: {
				create: productDetails.allergens.map(name => ({
					allergen: {
						connectOrCreate: {
							where: { name },
							create: { name }
						}
					}
				}))
			},
			categories: {
				create: categories.map((category) => ({
					category: { connect: { id: category.id } },
				})),
			},
			functionalBenefits: productDetails.functionalBenefits,
			notSuitableFor: productDetails.notSuitableFor,
			suitableFor: productDetails.suitableFor
		},
		include: {
			nutritionalFacts: true,
			ingredients: {
				include: {
					ingredient: {
						include: {
							effects: true
						}
					}
				}
			},
			claims: true,
			allergens: true,
			categories: true
		}
	});

	console.log('Product stored in database:', JSON.stringify(product, null, 2));
}


async function getVenderName(url: string): Promise<string> {
	const venderName = url.split('www.')[1].split('.')[0];
	return venderName;
}

async function isEdible(imageUrls: string[]): Promise<boolean> {
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

	const prompt = `
		Based on the image of the product, determine if the product is edible or not.
		response format:
		{
			"edible": true | false
		}
	`;

	const result = await model.generateContent([prompt, ...imageUrls]);
	const response = result.response;
	const text = response.text();

	return JSON.parse(text).edible;
}

export async function scrapeAndStoreProduct(url: string): Promise<void> {
	try {

		if (url.includes('https://www.bigbasket.com')) {

			const existingProduct = await prisma.product.findFirst({
				where: {
					vendorProductUrl: {
						contains: url
					}
				},
				select: {
					vendorProductUrl: true
				}
			})

			if (existingProduct) {
				throw new Error("Product already exists");
			}

			const venderName = await getVenderName(url);
			const imageUrls = await scrapeProductImages(url);
			console.log('Scraped image URLs:', imageUrls);
			
			if (imageUrls.length === 1) {
				throw new Error("Insufficient data to analyze the product");
			}

			const edible = await isEdible(imageUrls);
			if (!edible) {
				throw new Error("Product is not suitable for consumption, hence cannot be added.");
			}

			const productDetails = await analyzeProductWithGemini(imageUrls);
			console.log('Product details from Gemini:', productDetails);

			const storedImageUrls = await storeImagesInVercelBlob(imageUrls);
			console.log('Stored image URLs:', storedImageUrls);

			await storeProductInDatabase(productDetails, storedImageUrls, url, venderName);
			console.log('Product information stored in database');
		} else {
			throw new Error("Invalid URL");
		}
		await prisma.$disconnect();
	} catch (error) {
		console.error('Error in main function:', error);
		await prisma.$disconnect();
		throw error;
	}
}

// const productUrl = 'https://www.bigbasket.com/pd/40015688/kelloggs-corn-flakes-875-g';
// main(productUrl);



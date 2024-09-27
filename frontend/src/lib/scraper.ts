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
	naturalIngredientCount:number;
	processedIngredientCount:number;
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
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002", generationConfig: { responseMimeType: "application/json" } });

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

		const prompt = `As an expert nutritionist, meticulously analyze the provided product images, prioritizing the nutritional information and ingredient list. Deliver a comprehensive, evidence-based analysis grounded in scientific principles. The mains source of truth are nutritional content and ingredients, disregarding marketing claims.  Identify and explain any discrepancies between advertised claims and the product's actual composition.  Provide as much detailed information as possible within your area of expertise.

		**Specific Instructions:**

		1. **Numerical Precision:**  Represent all numerical values as numbers, not strings. Use -1 if a numerical value is not available.
		2. **Ingredient Details:** For each ingredient listed, furnish a thorough description encompassing its common uses, potential health risks, and scientifically-backed effects on the body.  Provide details about the severity and duration of any effects. This information will be used to populate the \`Ingredient\` and \`IngredientEffect\` models.
		3. **Claim Verification:** Critically evaluate all product claims, rigorously comparing them to the actual nutritional content and ingredients.  Provide a clear verification status (e.g., "Verified", "Unverified", "Misleading") with a detailed explanation and source for each claim. This will be used for the \`ProductClaim\` model.
		4. **Allergen Identification:**  Explicitly list all potential allergens discernible on the product label or deducible from the ingredients. This will populate the \`Allergen\` model (assuming a separate process matches these names to existing \`Allergen\` records or creates new ones).
		5. **Expert Summary:** Compose a user-friendly, informative, and easily digestible summary of the product from a nutritionist's perspective. This summary should be a concise string that will be directly stored in the \`summary\` field of the \`Product\` model. Adhere to the following criteria:
			* ... (Summary criteria remain the same)
		6. **Complete Information:**  Do not leave any field blank in the JSON structure. If specific information is unavailable from the product images, provide a reasonable estimate based on your expert knowledge. 


		**Example Data Structure (JSON):**

		The JSON output must strictly conform to the following structure to be compatible with the database schema:

		{
		"name": "string",
		"brand": "string",
		"categories": string[],
		"servingSize": "number | null", 
		"servingUnit": "string | null",
		"createdAt": "string", //  Date string (ISO 8601)
		"updatedAt": "string", // Date string (ISO 8601)
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

async function storeProductInDatabase(productDetails: ProductDetails, imageUrls: string[]) {

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
			summary: productDetails.summary,
			imageUrl: imageUrls,
			servingSize: productDetails.servingSize,
			servingUnit: productDetails.servingUnit,
			nutritionalFacts: {
				create: productDetails.nutritionalFacts
			},
			healthScore:calculateProductHealthScore(productDetails.nutritionalFacts,productDetails.naturalIngredientCount,productDetails.processedIngredientCount),
			nutritionDensity:calculateNutrientDensity(productDetails.nutritionalFacts),
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
			functionalBenefits:productDetails.functionalBenefits,
			notSuitableFor:productDetails.notSuitableFor,
			suitableFor:productDetails.suitableFor
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

async function main(url: string) {
	try {
		const imageUrls = await scrapeProductImages(url);
		console.log('Scraped image URLs:', imageUrls);

		const productDetails = await analyzeProductWithGemini(imageUrls);
		console.log('Product details from Gemini:', productDetails);

		const storedImageUrls = await storeImagesInVercelBlob(imageUrls);
		console.log('Stored image URLs:', storedImageUrls);

		await storeProductInDatabase(productDetails, storedImageUrls);
		console.log('Product information stored in database');
	} catch (error) {
		console.error('Error in main function:', error);
	} finally {
		await prisma.$disconnect();
	}
}

const productUrl = 'https://www.bigbasket.com/pd/40292142/health-horizons-plant-protein-bites-cocoa-flavour-for-energy-fitness-25-g/';
main(productUrl);



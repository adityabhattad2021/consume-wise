import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

interface ProductDetails {
	name: string;
	brand: string;
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

		const prompt = `Analyze these product images, focusing primarily on the nutritional information and ingredient list. Provide a thorough, evidence-based analysis. Focus on the actual nutritional content and ingredients rather than marketing claims. Highlight any discrepancies between claims and reality. If certain information is not visible or cannot be inferred from the images, omit those fields from the JSON output.

		Additional guidelines:
		1. Ensure all numerical values are provided as numbers, not strings.
		2. For the 'ingredients' array, provide as much detail as possible for each ingredient, including potential risks and effects.
		3. Critically evaluate all product claims, comparing them to the actual nutritional content and ingredients.
		4. Include all potential allergens visible on the product label or inferred from the ingredients.

		Your analysis should be comprehensive, accurate, and based on the visible information in the product images and your knowledge of food science and nutrition.

		The result should be in this JSON format:

		1. name: Full product name
		2. brand: Brand name
		3. categories: Array of relevant product categories
		4. servingSize: Number representing serving size
		5. servingUnit: Unit of measurement for serving size
		6. nutritionalFacts: Object containing the following nutritional information (all as numbers):
			- calories, totalFat, saturatedFat, transFat, cholesterol, sodium, totalCarbohydrate,
			dietaryFiber, totalSugars, addedSugars, protein, vitaminA, vitaminC, calcium, iron
		7. ingredients: Array of objects, each containing:
			- name: Ingredient name
			- description: Brief description of the ingredient
			- commonUses: Common uses of the ingredient in food products
			- potentialRisks: Any potential health risks or side effects
			- effects: Array of objects describing the effects of the ingredient (this is for research purpose ADD THIS), each containing:
			- effectType: Type of effect (e.g., "health benefit", "side effect")
			- description: Description of the effect
			- scientificEvidence: Brief summary of scientific evidence supporting the effect
			- severity: Severity of the effect 
			- duration: Duration of the effect
		8. claims: Array of objects, each containing:
			- claim: The product claim
			- verificationStatus: Status of claim verification, generate the status by considering the ingredients and nutritional details (e.g., "Verified", "Unverified","Misleading")
			- explanation: Explanation or context for the generated verification status for the claim
			- source: Source of the claim or its verification
		9. allergens: Array of potential allergens present in the product
	
		Provide as much detailed information as possible based on the product images and your knowledge. If certain information is not visible or cannot be inferred, you may omit those fields.`;

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
	const product = await prisma.product.create({
		data: {
			name: productDetails.name,
			brand: productDetails.brand,
			imageUrl: imageUrls,
			servingSize: productDetails.servingSize,
			servingUnit: productDetails.servingUnit,
			nutritionalFacts: {
				create: productDetails.nutritionalFacts
			},
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
				create: productDetails.categories.map(name => ({
					category: {
						connectOrCreate: {
							where: { name },
							create: { name }
						}
					}
				}))
			}
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

const productUrl = 'https://www.bigbasket.com/pd/40297523/the-whole-truth-pro-20g-protein-bar-coffee-cocoa-no-added-sugar-67-g/?nc=cl-prod-list&t_pos_sec=1&t_pos_item=1&t_s=Pro+20g+Protein+Bar+-+Coffee+Cocoa%252C+No+Added+Sugar';
main(productUrl);
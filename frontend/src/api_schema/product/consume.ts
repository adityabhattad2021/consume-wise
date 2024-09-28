import { z } from "zod";

export const consumeProductSchema = z.object({
    productId: z.number(),
    quantity: z.string(),
    duration: z.string(),
});
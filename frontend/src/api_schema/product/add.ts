import { z } from "zod";

export const addProductSchema = z.object({
    url: z.string().url(),
});
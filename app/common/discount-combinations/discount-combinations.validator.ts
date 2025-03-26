import { z } from "zod";

export const discountCombinations = z.object({
  product: z.boolean(),
  order: z.boolean(),
  shipping: z.boolean(),
});

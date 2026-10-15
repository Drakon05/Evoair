import { z } from 'zod';

export const cartItemSchema = z.object({
  variantId: z.number().int().positive('variantId must be a positive integer'),
  quantity: z
    .number()
    .int()
    .min(1, 'Quantity must be at least 1')
    .max(10, 'Quantity cannot exceed 10'),
});

export const cartValidateSchema = z.object({
  items: z
    .array(cartItemSchema)
    .min(1, 'Cart items array cannot be empty')
    .max(20, 'Cart cannot contain more than 20 items')
    .refine(
      (items) => {
        const ids = items.map((item) => item.variantId);
        return new Set(ids).size === ids.length;
      },
      {
        message: 'Duplicate variantIds are not allowed in cart',
      }
    ),
});

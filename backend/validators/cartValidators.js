import { z } from 'zod';

export const cartItemUpdateSchema = z.object({
  variantId: z.number().int().positive('variantId must be a positive integer'),
  quantity: z
    .number()
    .int()
    .min(0, 'Quantity cannot be negative')
    .max(10, 'Quantity cannot exceed 10'),
});

export const cartVariantParamSchema = z.object({
  variantId: z
    .string()
    .regex(/^\d+$/, 'variantId must be a positive integer')
    .transform(Number)
    .refine((n) => n > 0, 'variantId must be a positive integer'),
});

export const cartSyncItemSchema = z.object({
  variantId: z.number().int().positive('variantId must be a positive integer'),
  quantity: z
    .number()
    .int()
    .min(1, 'Quantity must be at least 1')
    .max(10, 'Quantity cannot exceed 10'),
});

export const cartSyncSchema = z.object({
  items: z
    .array(cartSyncItemSchema)
    .max(20, 'Cart cannot contain more than 20 items')
    .refine(
      (items) => {
        const ids = items.map((item) => item.variantId);
        return new Set(ids).size === ids.length;
      },
      {
        message: 'Duplicate variantIds are not allowed in sync payload',
      }
    ),
});

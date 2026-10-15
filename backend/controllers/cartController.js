import * as cartService from '../services/cartService.js';
import {
  cartItemUpdateSchema,
  cartSyncSchema,
} from '../validators/cartValidators.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

const validate = (schema, data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues ?? result.error.errors ?? [];
    const formatted = issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    throw new ValidationError('Validation failed', formatted);
  }
  return result.data;
};

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getUserCart(req.user.id);
  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

export const updateItem = asyncHandler(async (req, res) => {
  const validated = validate(cartItemUpdateSchema, req.body);
  const cart = await cartService.updateCartItem(
    req.user.id,
    validated.variantId,
    validated.quantity
  );
  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

export const removeItem = asyncHandler(async (req, res) => {
  const variantId = Number(req.params.variantId);
  if (!Number.isInteger(variantId) || variantId <= 0) {
    throw new NotFoundError('Invalid variant ID');
  }

  const cart = await cartService.removeCartItem(req.user.id, variantId);
  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearUserCart(req.user.id);
  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

export const syncCart = asyncHandler(async (req, res) => {
  const validated = validate(cartSyncSchema, req.body);
  const cart = await cartService.syncGuestCart(req.user.id, validated.items);
  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

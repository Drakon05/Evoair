import * as catalogService from '../services/catalogService.js';
import { cartValidateSchema } from '../validators/catalogValidators.js';
import { ValidationError } from '../utils/errors.js';

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

export const getProducts = asyncHandler(async (req, res) => {
  const products = await catalogService.getActiveProducts();
  res.status(200).json({
    status: 'success',
    data: { products },
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await catalogService.getProductBySlug(req.params.slug);
  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

export const validateCart = asyncHandler(async (req, res) => {
  const validatedData = validate(cartValidateSchema, req.body);
  const result = await catalogService.validateCartItems(validatedData.items);
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

import * as orderService from '../services/orderService.js';
import {
  createOrderSchema,
  idempotencyKeyHeaderSchema,
  orderIdParamSchema,
} from '../validators/orderValidators.js';
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

export const createOrder = asyncHandler(async (req, res) => {
  const rawKey = req.headers['idempotency-key'];
  const keyResult = idempotencyKeyHeaderSchema.safeParse(rawKey);
  if (!keyResult.success) {
    throw new ValidationError('Validation failed', [
      {
        field: 'Idempotency-Key',
        message: 'Idempotency-Key header is required and must be between 8 and 64 characters',
      },
    ]);
  }
  const idempotencyKey = keyResult.data;

  const validatedBody = validate(createOrderSchema, req.body);
  const result = await orderService.createOrder(req.user.id, idempotencyKey, validatedBody);

  const statusCode = result.isExisting ? 200 : 201;
  res.status(statusCode).json({
    status: 'success',
    data: { order: result.order },
  });
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id);
  res.status(200).json({
    status: 'success',
    data: { orders },
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = validate(orderIdParamSchema, req.params);

  const order = await orderService.getUserOrderById(req.user.id, id);
  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

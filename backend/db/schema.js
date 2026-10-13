import {
  pgTable,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  unique,
  index,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['customer', 'admin']);

export const orderStatusEnum = pgEnum('order_status', [
  'pending_payment',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
]);

// 1. Users
export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: text('password_hash').notNull(),
  name: text('name').notNull(),
  phone: varchar('phone', { length: 20 }),
  role: roleEnum('role').default('customer').notNull(),
  refresh_token_version: integer('refresh_token_version').default(0).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Addresses
export const addresses = pgTable('addresses', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id')
    .references(() => users.id)
    .notNull(),
  name: text('name').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  line1: text('line1').notNull(),
  line2: text('line2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pincode: varchar('pincode', { length: 10 }).notNull(),
  is_default: boolean('is_default').default(false).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Products
export const products = pgTable('products', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Product Variants (Shades)
export const productVariants = pgTable(
  'product_variants',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    product_id: integer('product_id')
      .references(() => products.id)
      .notNull(),
    shade_name: text('shade_name').notNull(),
    shade_code: varchar('shade_code', { length: 50 }).notNull(),
    sku: varchar('sku', { length: 100 }).notNull().unique(),
    price_paise: integer('price_paise').notNull(),
    stock_qty: integer('stock_qty').notNull(),
    is_active: boolean('is_active').default(true).notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('product_variants_product_id_idx').on(table.product_id),
    check('product_variants_stock_qty_check', sql`${table.stock_qty} >= 0`),
  ]
);

// 5. Orders
export const orders = pgTable(
  'orders',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer('user_id')
      .references(() => users.id)
      .notNull(),
    status: orderStatusEnum('status').default('pending_payment').notNull(),
    subtotal_paise: integer('subtotal_paise').notNull(),
    shipping_paise: integer('shipping_paise').notNull(),
    total_paise: integer('total_paise').notNull(),
    shipping_address: jsonb('shipping_address').notNull(),
    razorpay_order_id: varchar('razorpay_order_id', { length: 255 }),
    idempotency_key: varchar('idempotency_key', { length: 255 }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('orders_user_id_idx').on(table.user_id),
    unique('orders_user_id_idempotency_key_unique').on(table.user_id, table.idempotency_key),
  ]
);

// 6. Order Items
export const orderItems = pgTable(
  'order_items',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    order_id: integer('order_id')
      .references(() => orders.id)
      .notNull(),
    variant_id: integer('variant_id')
      .references(() => productVariants.id)
      .notNull(),
    quantity: integer('quantity').notNull(),
    unit_price_paise: integer('unit_price_paise').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('order_items_order_id_idx').on(table.order_id),
    check('order_items_quantity_check', sql`${table.quantity} > 0`),
  ]
);

// 7. Payments
export const payments = pgTable('payments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  order_id: integer('order_id')
    .references(() => orders.id)
    .notNull(),
  razorpay_payment_id: varchar('razorpay_payment_id', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 50 }).notNull(),
  amount_paise: integer('amount_paise').notNull(),
  raw_payload: jsonb('raw_payload'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 8. Shipments
export const shipments = pgTable('shipments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  order_id: integer('order_id')
    .references(() => orders.id)
    .notNull(),
  courier: text('courier'),
  awb: text('awb'),
  status: varchar('status', { length: 50 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

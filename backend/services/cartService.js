import { eq, and, asc, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { carts, cartItems, productVariants, products } from '../db/schema.js';
import { NotFoundError, AppError } from '../utils/errors.js';

export const getOrCreateCart = async (queryDb, userId) => {
  let [cart] = await queryDb
    .select({
      id: carts.id,
      user_id: carts.user_id,
      created_at: carts.created_at,
      updated_at: carts.updated_at,
    })
    .from(carts)
    .where(eq(carts.user_id, userId))
    .limit(1);

  if (!cart) {
    [cart] = await queryDb
      .insert(carts)
      .values({ user_id: userId })
      .onConflictDoNothing({ target: carts.user_id })
      .returning();

    if (!cart) {
      [cart] = await queryDb
        .select({
          id: carts.id,
          user_id: carts.user_id,
          created_at: carts.created_at,
          updated_at: carts.updated_at,
        })
        .from(carts)
        .where(eq(carts.user_id, userId))
        .limit(1);
    }
  }

  return cart;
};

export const getUserCart = async (userId) => {
  const cart = await getOrCreateCart(db, userId);

  const rows = await db
    .select({
      itemId: cartItems.id,
      quantity: cartItems.quantity,
      variantId: productVariants.id,
      productId: products.id,
      productName: products.name,
      productSlug: products.slug,
      shadeName: productVariants.shade_name,
      shadeCode: productVariants.shade_code,
      sku: productVariants.sku,
      pricePaise: productVariants.price_paise,
      stockQty: productVariants.stock_qty,
      variantIsActive: productVariants.is_active,
      productIsActive: products.is_active,
    })
    .from(cartItems)
    .innerJoin(productVariants, eq(cartItems.variant_id, productVariants.id))
    .innerJoin(products, eq(productVariants.product_id, products.id))
    .where(eq(cartItems.cart_id, cart.id))
    .orderBy(asc(cartItems.id));

  let totalPaise = 0;
  let totalCount = 0;

  const items = rows.map((row) => {
    const isAvailable =
      row.variantIsActive && row.productIsActive && row.stockQty >= row.quantity;
    const maxQuantity = row.variantIsActive && row.productIsActive
      ? Math.max(0, Math.min(row.stockQty, 10))
      : 0;
    const lineTotal = isAvailable ? row.pricePaise * row.quantity : 0;

    if (isAvailable) {
      totalPaise += lineTotal;
    }
    totalCount += row.quantity;

    return {
      id: row.itemId,
      variantId: row.variantId,
      productId: row.productId,
      productName: row.productName,
      productSlug: row.productSlug,
      shadeName: row.shadeName,
      shadeCode: row.shadeCode,
      sku: row.sku,
      pricePaise: row.pricePaise,
      quantity: row.quantity,
      available: isAvailable,
      inStock: row.stockQty > 0,
      maxQuantityAvailable: maxQuantity,
      lineTotalPaise: lineTotal,
    };
  });

  return {
    id: cart.id,
    userId: cart.user_id,
    items,
    totalCount,
    totalPaise,
    updatedAt: cart.updated_at,
  };
};

export const updateCartItem = async (userId, variantId, quantity) => {
  const cart = await getOrCreateCart(db, userId);

  if (quantity <= 0) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.cart_id, cart.id), eq(cartItems.variant_id, variantId)));
  } else {
    // Validate variant exists and is active
    const [variant] = await db
      .select({
        id: productVariants.id,
        isActive: productVariants.is_active,
        stockQty: productVariants.stock_qty,
      })
      .from(productVariants)
      .where(eq(productVariants.id, variantId))
      .limit(1);

    if (!variant || !variant.isActive) {
      throw new NotFoundError('Product variant not found or inactive');
    }

    if (variant.stockQty < quantity) {
      throw new AppError(`Only ${variant.stockQty} units available in stock`, 409);
    }

    await db
      .insert(cartItems)
      .values({
        cart_id: cart.id,
        variant_id: variantId,
        quantity,
      })
      .onConflictDoUpdate({
        target: [cartItems.cart_id, cartItems.variant_id],
        set: {
          quantity,
          updated_at: sql`now()`,
        },
      });
  }

  await db
    .update(carts)
    .set({ updated_at: sql`now()` })
    .where(eq(carts.id, cart.id));

  return getUserCart(userId);
};

export const removeCartItem = async (userId, variantId) => {
  const cart = await getOrCreateCart(db, userId);

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cart_id, cart.id), eq(cartItems.variant_id, variantId)));

  await db
    .update(carts)
    .set({ updated_at: sql`now()` })
    .where(eq(carts.id, cart.id));

  return getUserCart(userId);
};

export const clearUserCart = async (userId) => {
  const cart = await getOrCreateCart(db, userId);

  await db.delete(cartItems).where(eq(cartItems.cart_id, cart.id));

  await db
    .update(carts)
    .set({ updated_at: sql`now()` })
    .where(eq(carts.id, cart.id));

  return getUserCart(userId);
};

export const syncGuestCart = async (userId, guestItems) => {
  const cart = await getOrCreateCart(db, userId);

  if (guestItems && guestItems.length > 0) {
    for (const item of guestItems) {
      const [variant] = await db
        .select({
          id: productVariants.id,
          isActive: productVariants.is_active,
          stockQty: productVariants.stock_qty,
        })
        .from(productVariants)
        .where(eq(productVariants.id, item.variantId))
        .limit(1);

      if (variant && variant.isActive) {
        const qtyToSet = Math.min(item.quantity, 10);
        await db
          .insert(cartItems)
          .values({
            cart_id: cart.id,
            variant_id: item.variantId,
            quantity: qtyToSet,
          })
          .onConflictDoUpdate({
            target: [cartItems.cart_id, cartItems.variant_id],
            set: {
              quantity: sql`LEAST(10, ${cartItems.quantity} + ${qtyToSet})`,
              updated_at: sql`now()`,
            },
          });
      }
    }

    await db
      .update(carts)
      .set({ updated_at: sql`now()` })
      .where(eq(carts.id, cart.id));
  }

  return getUserCart(userId);
};

/**
 * NOTE: Price and stock values in this file are DEV PLACEHOLDERS, not confirmed business data.
 * - price_paise 280000 is a placeholder for the final customer price.
 *   Source: frontend/src/data/productOptions.js, line 5 ("price: '₹2,800'").
 *   Whether it includes GST is not decided yet.
 * - stock_qty means "how many units we are willing to sell right now" (production follows orders).
 *   Placeholder numbers are used, with Nebula (EVO-10) set to 0 specifically to test out-of-stock validation.
 * - Description "EvoAir" is used as the placeholder description because no product description exists in the frontend.
 */
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db, closeDb } from '../config/db.js';
import { env } from '../config/env.js';
import { products, productVariants } from './schema.js';

if (env.NODE_ENV === 'production') {
  console.error('❌ Cannot run seed in production environment!');
  process.exit(1);
}

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // 1. Insert product with onConflictDoNothing (Rule 1)
    await db
      .insert(products)
      .values({
        name: 'EvoAir',
        slug: 'evoair',
        description: 'EvoAir',
        is_active: true,
      })
      .onConflictDoNothing({ target: products.slug });

    // Retrieve product id
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, 'evoair'))
      .limit(1);

    if (!product) {
      throw new Error('Failed to retrieve or create EvoAir product');
    }

    // 2. Insert 10 shade variants with onConflictDoNothing (No hex values - Rule 3)
    const variantsData = [
      { shade_name: 'Halo', shade_code: '02', sku: 'EVO-01', price_paise: 280000, stock_qty: 50 },
      { shade_name: 'Flare', shade_code: '03', sku: 'EVO-02', price_paise: 280000, stock_qty: 50 },
      { shade_name: 'Serene', shade_code: '06', sku: 'EVO-03', price_paise: 280000, stock_qty: 30 },
      { shade_name: 'Astra', shade_code: '07', sku: 'EVO-04', price_paise: 280000, stock_qty: 40 },
      { shade_name: 'Amber', shade_code: '10', sku: 'EVO-05', price_paise: 280000, stock_qty: 25 },
      { shade_name: 'Dawn', shade_code: '11', sku: 'EVO-06', price_paise: 280000, stock_qty: 20 },
      { shade_name: 'Cosmic', shade_code: '14', sku: 'EVO-07', price_paise: 280000, stock_qty: 15 },
      { shade_name: 'Stardusk', shade_code: '15', sku: 'EVO-08', price_paise: 280000, stock_qty: 35 },
      { shade_name: 'Galaxy', shade_code: '18', sku: 'EVO-09', price_paise: 280000, stock_qty: 10 },
      { shade_name: 'Nebula', shade_code: '19', sku: 'EVO-10', price_paise: 280000, stock_qty: 0 },
    ];

    for (const v of variantsData) {
      await db
        .insert(productVariants)
        .values({
          product_id: product.id,
          shade_name: v.shade_name,
          shade_code: v.shade_code,
          sku: v.sku,
          price_paise: v.price_paise,
          stock_qty: v.stock_qty,
          is_active: true,
        })
        .onConflictDoNothing({ target: productVariants.sku });
    }

    // 3. Insert Evo-Fills Refills Product & Variant
    await db
      .insert(products)
      .values({
        name: 'Evo-Fills Refills',
        slug: 'evo-fills',
        description: '10 Pre-filled sterile formula capsules for zero mess and ultra-pure atomization.',
        is_active: true,
      })
      .onConflictDoNothing({ target: products.slug });

    const [evoFillsProduct] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, 'evo-fills'))
      .limit(1);

    if (evoFillsProduct) {
      await db
        .insert(productVariants)
        .values({
          product_id: evoFillsProduct.id,
          shade_name: 'Pre-filled Capsules (Pack of 10)',
          shade_code: 'CAPSULE-10',
          sku: 'EVO-FILL-10',
          price_paise: 250000,
          stock_qty: 50,
          is_active: true,
        })
        .onConflictDoNothing({ target: productVariants.sku });
    }

    // 4. Insert Evo-Bottles Empty (Coming Soon - stock 0)
    await db
      .insert(products)
      .values({
        name: 'Evo-Bottles Empty',
        slug: 'evo-bottles',
        description: 'Pack of 20 empty refillable capsules. Compatible with your own foundation formulas.',
        is_active: true,
      })
      .onConflictDoNothing({ target: products.slug });

    const [evoBottlesProduct] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, 'evo-bottles'))
      .limit(1);

    if (evoBottlesProduct) {
      await db
        .insert(productVariants)
        .values({
          product_id: evoBottlesProduct.id,
          shade_name: 'Empty Capsules (Pack of 20)',
          shade_code: 'BOTTLE-20',
          sku: 'EVO-BOTTLE-20',
          price_paise: 179900,
          stock_qty: 0, // Coming soon - 0 stock
          is_active: true,
        })
        .onConflictDoNothing({ target: productVariants.sku });
    }

    console.log('✅ Seeding completed successfully.');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  } finally {
    await closeDb();
  }
};

seed();

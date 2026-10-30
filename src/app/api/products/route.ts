import { NextRequest, NextResponse } from 'next/server';
import {
  getLiveCatalogProducts,
  addServerProduct,
  updateServerProduct,
  deleteServerProduct,
  restoreAllServerProducts,
} from '@/lib/server-catalog';
import { checkSupabaseHealth } from '@/lib/supabase-catalog';
import type { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const checkStatus = searchParams.get('status') === 'true';

    if (checkStatus) {
      const health = await checkSupabaseHealth();
      return NextResponse.json(health, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const cookieHeader = req.cookies.get('guna_deleted_ids')?.value;
    let cookieDeleted: string[] = [];
    if (cookieHeader) {
      try {
        const parsed = JSON.parse(decodeURIComponent(cookieHeader));
        if (Array.isArray(parsed)) cookieDeleted = parsed;
      } catch {}
    }

    const { products, source, supabaseHealth } = await getLiveCatalogProducts(cookieDeleted);

    if (searchParams.get('meta') === 'true') {
      return NextResponse.json(
        {
          products,
          source,
          supabaseHealth,
          count: products.length,
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products', details: error?.message, stack: error?.stack }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get('action') === 'restore') {
      restoreAllServerProducts();
      return NextResponse.json({ success: true, message: 'All deleted products restored' }, { status: 200 });
    }

    const product: Product = await req.json();
    if (!product || !product.id || !product.name) {
      return NextResponse.json({ error: 'Invalid product data: id and name are required' }, { status: 400 });
    }
    const added = addServerProduct(product);
    return NextResponse.json(added, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const product: Product = await req.json();
    if (!product || !product.id) {
      return NextResponse.json({ error: 'Invalid product data: id is required' }, { status: 400 });
    }
    const updated = updateServerProduct(product);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');
    let slug = searchParams.get('slug');

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
        slug = body?.slug;
      } catch {
        // body parsing optional
      }
    }

    if (!id && !slug) {
      return NextResponse.json({ error: 'Missing product ID or slug' }, { status: 400 });
    }

    if (id) deleteServerProduct(id);
    if (slug && slug !== id) deleteServerProduct(slug);

    return NextResponse.json(
      { success: true, deletedId: id || slug },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

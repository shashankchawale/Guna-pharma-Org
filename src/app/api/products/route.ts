import { NextRequest, NextResponse } from 'next/server';
import {
  getAllProducts,
  addServerProduct,
  updateServerProduct,
  deleteServerProduct,
} from '@/lib/catalog';
import type { Product } from '@/types';

export async function GET() {
  const all = getAllProducts();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  try {
    const product: Product = await req.json();
    if (!product || !product.id || !product.name) {
      return NextResponse.json({ error: 'Missing product details' }, { status: 400 });
    }
    const saved = addServerProduct(product);
    return NextResponse.json({ success: true, product: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const product: Product = await req.json();
    if (!product || !product.id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }
    const updated = updateServerProduct(product);
    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing product id parameter' }, { status: 400 });
    }
    deleteServerProduct(id);
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete product' }, { status: 500 });
  }
}

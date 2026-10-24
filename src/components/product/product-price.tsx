'use client';

import { useFormatPrice } from '@/store/locale';

interface ProductPriceProps {
  sellingPrice: number;
  mrp: number;
  discountPercent: number;
}

export function ProductPrice({ sellingPrice, mrp, discountPercent }: ProductPriceProps) {
  const formatPrice = useFormatPrice();

  return (
    <div className="mt-5 flex items-end gap-3">
      <strong className="text-3xl font-extrabold text-navy">{formatPrice(sellingPrice)}</strong>
      <span className="mb-1 text-base text-gray-400 line-through">{formatPrice(mrp)}</span>
      <span className="mb-1 text-sm font-bold text-success">{discountPercent}% off</span>
    </div>
  );
}

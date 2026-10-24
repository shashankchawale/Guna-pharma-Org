'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const styles = { default: 'bg-primary-light text-primary border border-primary/20', secondary: 'bg-gray-100 text-gray-700 border border-gray-200', destructive: 'bg-error-light text-error border border-error/20', success: 'bg-success-light text-success border border-success/20', warning: 'bg-warning-light text-warning border border-warning/20', outline: 'text-navy border-2 border-border', ghost: 'text-gray-600 hover:bg-gray-100' } as const;
type Variant = keyof typeof styles;
type Size = 'default' | 'sm' | 'lg';
const sizeStyles: Record<Size, string> = { default: 'px-2.5 py-0.5 text-xs', sm: 'px-2 py-0.5 text-[10px]', lg: 'px-3 py-1 text-sm' };
export const badgeVariants = ({ variant = 'default', size = 'default', className }: { variant?: Variant; size?: Size; className?: string } = {}) => cn('inline-flex items-center rounded-xl font-medium transition-colors duration-fast', styles[variant], sizeStyles[size], className);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  size?: Size;
}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={badgeVariants({ variant, size, className })} {...props} />;
}

export { Badge };

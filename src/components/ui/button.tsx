'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const variantClasses = { default: 'bg-primary text-white hover:bg-primary-hover shadow-soft', destructive: 'bg-error text-white hover:bg-red-700 shadow-soft', outline: 'border-2 border-border bg-transparent hover:bg-primary-light text-primary', secondary: 'bg-navy text-white hover:bg-navy-light shadow-soft', ghost: 'hover:bg-primary-light text-primary', link: 'text-primary underline-offset-4 hover:underline', success: 'bg-success text-white hover:bg-green-700 shadow-soft' } as const;
const sizeClasses = { default: 'h-11 px-4 py-2', sm: 'h-9 rounded-xl px-3 text-xs', lg: 'h-12 rounded-2xl px-6 text-base', xl: 'h-14 rounded-3xl px-8 text-lg', icon: 'h-11 w-11' } as const;
type Variant = keyof typeof variantClasses;
type Size = keyof typeof sizeClasses;
export const buttonVariants = ({ variant = 'default', size = 'default', className }: { variant?: Variant; size?: Size; className?: string } = {}) => cn('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]', variantClasses[variant], sizeClasses[size], className);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = 'button';
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button };

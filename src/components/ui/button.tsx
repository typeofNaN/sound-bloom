import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 motion-safe:transition-[background-color,color,box-shadow,transform] motion-safe:duration-150 motion-safe:active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'bg-accent text-surface hover:brightness-110',
        outline: 'border border-foreground/20 bg-panel hover:bg-foreground/8',
        ghost: 'hover:bg-foreground/8',
        plain: '',
      },
      size: { default: 'min-h-10 px-4', icon: 'size-10', bare: '' },
    },
    defaultVariants: { variant: 'plain', size: 'bare' },
  },
);

export function Button({
  className,
  variant,
  size,
  type = 'button',
  ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

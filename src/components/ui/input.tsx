import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

export function Input({ className, type = 'text', ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-10 w-full min-w-0 rounded-md border border-foreground/20 bg-panel px-3 py-1 text-sm text-foreground shadow-xs outline-none placeholder:text-muted focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-50 motion-safe:transition-[border-color,box-shadow]',
        className,
      )}
      {...props}
    />
  );
}

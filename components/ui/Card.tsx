import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('rounded-card bg-white shadow-kid p-6 border-0', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'


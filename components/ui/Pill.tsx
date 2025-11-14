import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary'
}

export const Pill: React.FC<PillProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-4 py-2 rounded-full text-lg font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}


'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', variant = 'default', className, onClick, disabled, type, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-12 w-12',
      md: 'h-16 w-16',
      lg: 'h-20 w-20',
    }

    const variantClasses = {
      default: 'bg-primary-500 text-white hover:bg-primary-600',
      ghost: 'bg-transparent hover:bg-gray-100',
      outline: 'border-2 border-primary-500 bg-transparent',
    }

    return (
      <motion.button
        ref={ref}
        type={type || 'button'}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'rounded-full flex items-center justify-center transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-primary-500',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        aria-label={props['aria-label']}
        aria-labelledby={props['aria-labelledby']}
      >
        {icon}
      </motion.button>
    )
  }
)
IconButton.displayName = 'IconButton'


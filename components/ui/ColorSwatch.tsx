'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

export interface ColorSwatchProps {
  color: string
  name: string
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  name,
  onClick,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-24 w-24',
    md: 'h-32 w-32',
    lg: 'h-48 w-48',
  }

  return (
    <motion.div
      className={cn('rounded-full cursor-pointer', sizeClasses[size], className)}
      style={{ backgroundColor: color }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      role="button"
      aria-label={name}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    />
  )
}


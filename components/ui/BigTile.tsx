'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

export interface BigTileProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export const BigTile = React.forwardRef<HTMLDivElement, BigTileProps>(
  ({ children, icon, onClick, disabled, className, ...props }, ref) => {
    const content = (
      <div
        ref={ref}
        className={cn(
          'tile-base cursor-pointer flex flex-col items-center justify-center p-6 gap-4',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={disabled ? undefined : onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        onKeyDown={onClick && !disabled ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        } : undefined}
        {...props}
      >
        {icon && <div className="text-6xl">{icon}</div>}
        <div className="text-2xl font-bold text-center">{children}</div>
      </div>
    )

    if (onClick && !disabled) {
      return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {content}
        </motion.div>
      )
    }

    return content
  }
)
BigTile.displayName = 'BigTile'


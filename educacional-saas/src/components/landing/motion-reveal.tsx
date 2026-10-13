'use client'

import { useReducedMotion, motion } from 'framer-motion'
import type { ReactNode } from 'react'

type MotionRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function MotionReveal({
  children,
  className,
  delay = 0,
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { MotionPage } from '@/motion/MotionPage'

export const Route = createFileRoute('/motion')({
  component: MotionPage,
})

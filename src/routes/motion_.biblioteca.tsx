import { createFileRoute } from '@tanstack/react-router'
import { LibraryPage } from '@/motion/LibraryPage'

export const Route = createFileRoute('/motion_/biblioteca')({
  component: LibraryPage,
})

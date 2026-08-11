import { createFileRoute, redirect } from '@tanstack/react-router'

/* A home é o /motion — o link oficial é designviral.vercel.app/motion. */
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/motion' })
  },
})

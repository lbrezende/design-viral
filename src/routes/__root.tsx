import { createRootRoute, Outlet } from '@tanstack/react-router'

/* Raiz enxuta: o Design Viral só tem o /motion e a biblioteca — cada página
   monta a própria nav, então a raiz não põe chrome nenhum em volta. */
export const Route = createRootRoute({
  component: () => <Outlet />,
})

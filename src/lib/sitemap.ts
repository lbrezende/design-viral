import { routeTree } from '../routeTree.gen'

// Função para extrair todas as rotas do TanStack Router
export function getAllRoutes(): string[] {
  const routes: string[] = []

  // Função recursiva para extrair todas as rotas
  function extractRoutes(route: any, parentPath = '') {
    if (route.path) {
      const fullPath = parentPath + route.path
      // Remove barras duplas e normaliza o path
      const normalizedPath =
        fullPath.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
      routes.push(normalizedPath)
    }

    // Processa rotas filhas
    if (route.children) {
      Object.values(route.children).forEach((child: any) => {
        extractRoutes(child, route.path || parentPath)
      })
    }
  }

  extractRoutes(routeTree)

  // Remove duplicatas e retorna rotas únicas
  return [...new Set(routes)]
}

// Função para obter rotas com metadados para o sitemap
export function getRoutesWithMetadata() {
  const routes = getAllRoutes()

  return routes.map(route => ({
    path: route,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly' as const,
    priority: route === '/' ? 1.0 : 0.8,
  }))
}

// Função para obter rotas como array simples de strings
export function getRoutesArray(): string[] {
  return getAllRoutes()
}

// Função para obter rotas com configurações específicas
export function getRoutesConfig() {
  return {
    routes: getAllRoutes(),
    totalRoutes: getAllRoutes().length,
    sitemapData: getRoutesWithMetadata(),
  }
}

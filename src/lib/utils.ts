import { type ClassValue, clsx } from 'clsx'
import { parsePhoneNumber } from 'libphonenumber-js'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para extrair todas as rotas do TanStack Router
export function getAllRoutes() {
  // Importa o routeTree gerado automaticamente
  const { routeTree } = require('../routeTree.gen')

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

// Função para obter rotas com metadados (título, descrição, etc.)
export function getRoutesWithMetadata() {
  const routes = getAllRoutes()

  return routes.map(route => ({
    path: route,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly' as const,
    priority: route === '/' ? 1.0 : 0.8,
  }))
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

export function objectToQueryString(obj: any) {
  const keys = Object.keys(obj)
  const keyValuePairs = keys.map(key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
  })

  return keyValuePairs.join('&')
}

export function isPhoneValid(phone: string) {
  try {
    return parsePhoneNumber(phone)?.isValid()
  } catch {
    return false
  }
}

/**
 * Faz scroll suave para um elemento interno preservando os parâmetros UTM da URL atual
 * @param elementId - ID do elemento para fazer scroll
 * @param behavior - Comportamento do scroll (default: 'smooth')
 */
export function scrollToElement(
  elementId: string,
  behavior: ScrollBehavior = 'smooth',
) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior })
  }
}

import { useQuery } from '@tanstack/react-query'
import { searchVehicleCatalog, getCarParts, getMaintenanceGuides, getNewsArticles, getNewsArticle } from '../lib/api/knowledge'

export function useVehicleCatalog(filters = {}) {
  return useQuery({
    queryKey: ['knowledge', 'catalog', filters],
    queryFn: async () => {
      const { data, error } = await searchVehicleCatalog(filters)
      if (error) throw error
      return data ?? []
    },
    staleTime: 1000 * 60 * 10, // catalog changes rarely
  })
}

export function useCarParts(category = null) {
  return useQuery({
    queryKey: ['knowledge', 'parts', category],
    queryFn: async () => {
      const { data, error } = await getCarParts(category)
      if (error) throw error
      return data ?? []
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function useMaintenanceGuides(filters = {}) {
  return useQuery({
    queryKey: ['knowledge', 'guides', filters],
    queryFn: async () => {
      const { data, error } = await getMaintenanceGuides(filters)
      if (error) throw error
      return data ?? []
    },
  })
}

export function useNews(filters = {}) {
  return useQuery({
    queryKey: ['knowledge', 'news', filters],
    queryFn: async () => {
      const { data, error } = await getNewsArticles(filters)
      if (error) throw error
      return data ?? []
    },
  })
}

export function useNewsArticle(slug) {
  return useQuery({
    queryKey: ['knowledge', 'article', slug],
    queryFn: async () => {
      const { data, error } = await getNewsArticle(slug)
      if (error) throw error
      return data
    },
    enabled: !!slug,
  })
}

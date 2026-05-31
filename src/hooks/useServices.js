import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getServices, getService, submitServiceEnquiry, submitServiceReview } from '../lib/api/services'
import { notify } from '../components/ui/Toast'

export function useServices(filters = {}) {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: async () => {
      const { data, error } = await getServices(filters)
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useService(id) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const { data, error } = await getService(id)
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useServiceEnquiry() {
  return useMutation({
    mutationFn: submitServiceEnquiry,
    onSuccess: () => notify.success('Message sent! The provider will call you back.'),
    onError: (err) => notify.error(err.message || 'Failed to send enquiry'),
  })
}

export function useServiceReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: submitServiceReview,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['service', vars.serviceId] })
      qc.invalidateQueries({ queryKey: ['services'] })
      notify.success('Review submitted!')
    },
    onError: (err) => notify.error(err.message),
  })
}

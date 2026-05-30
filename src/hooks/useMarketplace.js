import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getVehicleListings, createVehicleListing, getPartsListings, createPartsListing, sendEnquiry } from '../lib/api/marketplace'
import { notify } from '../components/ui/Toast'

// ── Query Keys ────────────────────────────────────────────
export const KEYS = {
  vehicles: (filters) => ['marketplace', 'vehicles', filters],
  parts:    (filters) => ['marketplace', 'parts', filters],
}

// ── Vehicles ──────────────────────────────────────────────
export function useVehicleListings(filters = {}) {
  return useQuery({
    queryKey: KEYS.vehicles(filters),
    queryFn: async () => {
      const { data, error } = await getVehicleListings({ filters })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useCreateVehicleListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ listing, files }) => createVehicleListing(listing, files),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['marketplace', 'vehicles'] })
      notify.success('Vehicle listing posted!')
    },
    onError: (err) => notify.error(err.message || 'Failed to post listing'),
  })
}

// ── Parts ─────────────────────────────────────────────────
export function usePartsListings(filters = {}) {
  return useQuery({
    queryKey: KEYS.parts(filters),
    queryFn: async () => {
      const { data, error } = await getPartsListings({ filters })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useCreatePartsListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ listing, files }) => createPartsListing(listing, files),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['marketplace', 'parts'] })
      notify.success('Parts listing posted!')
    },
    onError: (err) => notify.error(err.message || 'Failed to post listing'),
  })
}

// ── Enquiries ─────────────────────────────────────────────
export function useSendEnquiry() {
  return useMutation({
    mutationFn: sendEnquiry,
    onSuccess: () => notify.success('Enquiry sent to seller!'),
    onError:   (err) => notify.error(err.message || 'Failed to send enquiry'),
  })
}

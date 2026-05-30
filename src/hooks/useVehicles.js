import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle, addModification, addTimelineEntry } from '../lib/api/vehicles'
import { notify } from '../components/ui/Toast'

export function useMyVehicles() {
  return useQuery({
    queryKey: ['vehicles', 'mine'],
    queryFn: async () => {
      const { data, error } = await getMyVehicles()
      if (error) throw error
      return data ?? []
    },
  })
}

export function useVehicle(id) {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: async () => {
      const { data, error } = await getVehicle(id)
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCreateVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vehicles', 'mine'] })
      notify.success('Vehicle added to your garage!')
    },
    onError: (err) => notify.error(err.message || 'Failed to add vehicle'),
  })
}

export function useUpdateVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => updateVehicle(id, updates),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['vehicles', vars.id] })
      qc.invalidateQueries({ queryKey: ['vehicles', 'mine'] })
      notify.success('Vehicle updated!')
    },
    onError: (err) => notify.error(err.message),
  })
}

export function useDeleteVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vehicles', 'mine'] })
      notify.success('Vehicle removed from garage')
    },
    onError: (err) => notify.error(err.message),
  })
}

export function useAddModification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ vehicleId, mod }) => addModification(vehicleId, mod),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['vehicles', vars.vehicleId] })
      notify.success('Modification added!')
    },
    onError: (err) => notify.error(err.message),
  })
}

export function useAddTimelineEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ vehicleId, entry }) => addTimelineEntry(vehicleId, entry),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['vehicles', vars.vehicleId] })
      notify.success('Timeline entry added!')
    },
    onError: (err) => notify.error(err.message),
  })
}

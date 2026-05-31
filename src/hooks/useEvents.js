import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEvents, getEvent, createEvent, joinEvent, leaveEvent, getMyAttendance } from '../lib/api/events'
import { notify } from '../components/ui/Toast'

export function useEvents(filters = {}) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const { data, error } = await getEvents(filters)
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 3,
  })
}

export function useEvent(id) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await getEvent(id)
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ event, coverFile }) => createEvent(event, coverFile),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] })
      notify.success('Event published!')
    },
    onError: (err) => notify.error(err.message || 'Failed to create event'),
  })
}

export function useJoinEvent(eventId) {
  const qc = useQueryClient()
  const { data: attendance } = useQuery({
    queryKey: ['event-attendance', eventId],
    queryFn: async () => {
      const { data } = await getMyAttendance(eventId)
      return data
    },
    enabled: !!eventId,
  })

  const join = useMutation({
    mutationFn: (status) => joinEvent(eventId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] })
      qc.invalidateQueries({ queryKey: ['event', eventId] })
      qc.invalidateQueries({ queryKey: ['event-attendance', eventId] })
      notify.success('You\'re going!')
    },
    onError: (err) => notify.error(err.message),
  })

  const leave = useMutation({
    mutationFn: () => leaveEvent(eventId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] })
      qc.invalidateQueries({ queryKey: ['event', eventId] })
      qc.invalidateQueries({ queryKey: ['event-attendance', eventId] })
      notify.success('Attendance removed')
    },
    onError: (err) => notify.error(err.message),
  })

  return {
    attendance,
    isGoing: attendance?.status === 'going',
    join: (status = 'going') => join.mutate(status),
    leave: () => leave.mutate(),
    isPending: join.isPending || leave.isPending,
  }
}

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getNotifications, getUnreadCount,
  markNotificationRead, markAllNotificationsRead,
  subscribeToNotifications,
} from '../lib/api/notifications'

export function useNotifications() {
  const qc = useQueryClient()
  const { user } = useAuth()

  const query = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await getNotifications({ page: pageParam })
      if (error) throw error
      return data
    },
    getNextPageParam: (lastPage, pages) => lastPage.length === 30 ? pages.length : undefined,
    initialPageParam: 0,
    enabled: !!user,
  })

  // Real-time new notifications
  useEffect(() => {
    if (!user) return
    const channel = subscribeToNotifications(user.id, (newNotif) => {
      qc.setQueryData(['notifications'], (old) => {
        if (!old) return old
        return {
          ...old,
          pages: [[newNotif, ...(old.pages[0] ?? [])], ...old.pages.slice(1)],
        }
      })
      qc.invalidateQueries({ queryKey: ['notifications-count'] })
    })
    return () => channel.unsubscribe()
  }, [user?.id])

  return query
}

export function useUnreadCount() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['notifications-count'],
    queryFn: async () => {
      const { count } = await getUnreadCount()
      return count
    },
    enabled: !!user,
    refetchInterval: 30000, // poll every 30s as backup
  })
}

export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      qc.invalidateQueries({ queryKey: ['notifications-count'] })
    },
  })
}

export function useMarkAllRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      qc.setQueryData(['notifications-count'], 0)
    },
  })
}

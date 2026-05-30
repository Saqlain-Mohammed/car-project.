import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { getCommunities, joinCommunity, leaveCommunity, getCommunityMessages, sendCommunityMessage, subscribeToCommunityMessages } from '../lib/api/communities'
import { notify } from '../components/ui/Toast'
import { useEffect } from 'react'

export function useCommunities(search = '', type = null) {
  return useQuery({
    queryKey: ['communities', search, type],
    queryFn: async () => {
      const { data, error } = await getCommunities({ search, type })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useJoinCommunity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: joinCommunity,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communities'] })
      notify.success('Joined crew!')
    },
    onError: (err) => notify.error(err.message || 'Already a member'),
  })
}

export function useLeaveCommunity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: leaveCommunity,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communities'] })
      notify.success('Left crew')
    },
    onError: (err) => notify.error(err.message),
  })
}

export function useCommunityMessages(communityId) {
  const qc = useQueryClient()
  const queryKey = ['community-messages', communityId]

  // Initial fetch
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await getCommunityMessages(communityId)
      if (error) throw error
      return data ?? []
    },
    enabled: !!communityId,
  })

  // Real-time subscription
  useEffect(() => {
    if (!communityId) return
    const channel = subscribeToCommunityMessages(communityId, (newMsg) => {
      qc.setQueryData(queryKey, (old) => [...(old ?? []), newMsg])
    })
    return () => channel.unsubscribe()
  }, [communityId])

  return query
}

export function useSendCommunityMessage() {
  return useMutation({
    mutationFn: ({ communityId, body }) => sendCommunityMessage(communityId, body),
    onError: (err) => notify.error(err.message || 'Failed to send message'),
  })
}

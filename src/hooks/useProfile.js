import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateProfile, uploadAvatar, followUser, unfollowUser, isFollowing } from '../lib/api/profiles'
import { notify } from '../components/ui/Toast'
import { useAuth } from '../context/AuthContext'

export function useProfile(username) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const { data, error } = await getProfile(username)
      if (error) throw error
      return data
    },
    enabled: !!username,
  })
}

export function useCurrentProfile() {
  const { user } = useAuth()
  const username = user?.user_metadata?.username
  return useProfile(username)
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: (updates) => updateProfile(user.id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      notify.success('Profile updated!')
    },
    onError: (err) => notify.error(err.message || 'Update failed'),
  })
}

export function useUploadAvatar() {
  const qc = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: (file) => uploadAvatar(user.id, file),
    onSuccess: ({ url }) => {
      // also update the profile row
      updateProfile(user.id, { avatar_url: url })
      qc.invalidateQueries({ queryKey: ['profile'] })
      notify.success('Avatar updated!')
    },
    onError: (err) => notify.error(err.message || 'Upload failed'),
  })
}

export function useFollow(targetUserId) {
  const qc = useQueryClient()
  const { data: following } = useQuery({
    queryKey: ['following', targetUserId],
    queryFn: () => isFollowing(targetUserId),
    enabled: !!targetUserId,
  })

  const toggle = useMutation({
    mutationFn: () => following ? unfollowUser(targetUserId) : followUser(targetUserId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['following', targetUserId] })
      qc.invalidateQueries({ queryKey: ['profile'] })
      notify.success(following ? 'Unfollowed' : 'Following!')
    },
    onError: (err) => notify.error(err.message),
  })

  return { following: !!following, toggle: toggle.mutate, isPending: toggle.isPending }
}

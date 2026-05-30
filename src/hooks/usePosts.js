import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFeed, createPost, likePost, unlikePost, addComment, savePost } from '../lib/api/posts'
import { notify } from '../components/ui/Toast'

export function useFeed(type = null) {
  return useInfiniteQuery({
    queryKey: ['feed', type],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await getFeed({ page: pageParam, limit: 20, type })
      if (error) throw error
      return data ?? []
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 20 ? pages.length : undefined,
    initialPageParam: 0,
  })
}

export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ post, files }) => createPost(post, files),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] })
      notify.success('Post published!')
    },
    onError: (err) => notify.error(err.message || 'Failed to publish post'),
  })
}

export function useLikePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, liked }) => liked ? unlikePost(postId) : likePost(postId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feed'] }),
    onError: (err) => notify.error(err.message),
  })
}

export function useAddComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, body, parentId }) => addComment(postId, body, parentId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['comments', vars.postId] })
      qc.invalidateQueries({ queryKey: ['feed'] })
    },
    onError: (err) => notify.error(err.message),
  })
}

export function useSavePost() {
  return useMutation({
    mutationFn: savePost,
    onSuccess: () => notify.success('Saved!'),
    onError:   (err) => notify.error(err.message),
  })
}

export { Toaster } from 'react-hot-toast'
export { default as toast } from 'react-hot-toast'

// Pre-configured toast helpers used across the app
import toast from 'react-hot-toast'

export const notify = {
  success: (msg) => toast.success(msg, { duration: 3000 }),
  error:   (msg) => toast.error(msg,   { duration: 4000 }),
  loading: (msg) => toast.loading(msg),
  dismiss: (id)  => toast.dismiss(id),
  promise: (promise, msgs) => toast.promise(promise, msgs),
}

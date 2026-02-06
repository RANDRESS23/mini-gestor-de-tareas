import { toast } from 'sonner'
import confetti from 'canvas-confetti'

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
  })
}

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
  })
}

export const showInfoToast = (message: string) => {
  toast.info(message, {
    duration: 3000,
    position: 'top-right',
  })
}

export const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  })
}

export const triggerBigConfetti = () => {
  confetti({
    particleCount: 200,
    spread: 120,
    origin: { y: 0.6 }
  })
}

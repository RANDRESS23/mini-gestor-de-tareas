import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={cn(sizeClasses[size], className)}
    >
      <Loader2 className="w-full h-full text-blue-600" />
    </motion.div>
  )
}

export default Spinner

import { motion } from 'framer-motion'

type Props = {
  show: boolean
}

export function Declaration({ show }: Props) {
  return (
    <motion.div
      className="overflow-hidden bg-fuchsia-50"
      variants={{
        show: { width: '24rem' },
        hide: { width: '0' },
      }}
      animate={show ? 'show' : 'hide'}
    >
      HELLO
    </motion.div>
  )
}

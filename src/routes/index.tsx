import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return 'hi'
}

import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/conversation')({
  component: Conversation,
})

function Conversation() {
  const [step, setStep] = useState<'prompt' | 'chat'>('prompt')
  const chatFormRef = useRef<HTMLFormElement>(null)
  const [chatFormPostion, setChatFormPosition] = useState({ x: 0, y: 0 })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const prompt = formData.get('prompt') as string

    console.log(prompt)

    setStep('chat')
  }

  const onResize = useCallback(() => {
    console.log(chatFormRef.current)
    if (chatFormRef.current === null) {
      return
    }

    const { x, y } = chatFormRef.current.getBoundingClientRect()

    console.log({ x, y })

    setChatFormPosition({ x, y })
  }, [])

  useEffect(() => {
    onResize()

    const element = document.querySelector('body')

    if (!element) {
      return
    }

    const observer = new ResizeObserver(onResize)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [onResize])

  return (
    <div className="flex items-center justify-center h-screen w-screen relative">
      {/* <div className="absolute top-0 left-0 z-50">
        <button onClick={() => setStep('prompt')}>prompt</button>
        <button onClick={() => setStep('chat')}>chat</button>
      </div> */}

      <motion.div
        className="w-full h-full bg-white absolute inset-0 flex items-center justify-center"
        variants={{
          prompt: { opacity: 1 },
          chat: { opacity: 0 },
        }}
        animate={step}
      />

      {/* <div className="absolute inset-0 pt-32">{JSON.stringify(chatFormPostion)}</div> */}

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.form
          initial={false}
          onSubmit={onSubmit}
          className="flex gap-2 absolute"
          variants={{
            prompt: {
              width: '60%',
            },
            chat: {
              left: chatFormPostion.x,
              top: chatFormPostion.y,
              width: 'calc(50% - 2rem)',
            },
          }}
          animate={step}
        >
          <motion.input
            type="text"
            name="prompt"
            className="border border-gray-600 rounded px-2 py-1 flex-1"
            placeholder={step === 'prompt' ? 'Otrzymałem/am pożyczkę od dziadka i babci' : ''}
          />
          <AnimatePresence>
            <motion.button className="flex bg-sky-700 rounded px-4 text-white font-semibold relative">
              <motion.span
                variants={{
                  prompt: { width: 'auto', opacity: 1 },
                  chat: { width: 0, opacity: 0 },
                }}
                className="flex items-center overflow-hidden whitespace-nowrap"
              >
                Sprawdź formularz
              </motion.span>
              <motion.span
                variants={{
                  prompt: { width: 0, opacity: 0 },
                  chat: { width: 'auto', opacity: 1 },
                }}
                className="flex items-center overflow-hidden whitespace-nowrap"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </motion.span>
            </motion.button>
          </AnimatePresence>
        </motion.form>
      </div>

      <div className="flex w-full h-full">
        <div className="w-1/2 bg-fuchsia-400 flex items-end">
          <div className="flex p-4 opacity-0" hidden>
            <form onSubmit={onSubmit} className="flex gap-2" ref={chatFormRef}>
              <input type="text" name="prompt" className="border border-gray-600 rounded px-2 py-1 w-[32rem]" />
              <button className="bg-sky-700 white rounded px-4 text-white font-semibold">
                <PaperAirplaneIcon className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
        <div className="w-1/2 bg-fuchsia-500"></div>
      </div>
    </div>
  )
}

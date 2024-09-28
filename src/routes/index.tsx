import { chat } from '@/api'
import { Avatar } from '@/components/Avatar'
import { Declaration } from '@/components/Declaration'
import { InitialMessage } from '@/components/InitialMessage'
import { OurChatInput } from '@/components/OurChatInput'
import { ChatBubble, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { Message, Model } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import merge from 'lodash.merge'
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const convIdRef = useRef(Math.random().toString())
  const modelRef = useRef<Model | null>(null)
  const [hasModel, setHasModel] = useState(false)
  const { isPending: isGenerating, mutate } = useMutation({
    mutationFn: chat,
    onSuccess(data) {
      setMessages((messages) => [...messages, { role: 'assistant', content: data.text }])
      modelRef.current = merge(modelRef.current, data.model)
      setHasModel(true)
    },
  })

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  const disabled = input === '' || isGenerating

  const onSubmit = async (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()

    if (disabled) {
      return
    }

    mutate({
      conv_id: convIdRef.current,
      declaration: modelRef.current ?? {},
      messages: [{ role: 'user', content: input }],
    })
    setInput('')
    setMessages((messages) => [...messages, { role: 'user', content: input }])
  }

  return (
    <main className="flex h-screen w-full max-w-4xl mx-auto py-6">
      <div className="flex flex-col items-center flex-1">
        <ChatMessageList ref={messagesRef}>
          {messages.length === 0 && <InitialMessage />}

          {/* Messages */}
          {messages.map((message, index) => (
            <ChatBubble key={index} variant={message.role == 'user' ? 'sent' : 'received'}>
              <Avatar role={message.role} />

              <ChatBubbleMessage>{message.content}</ChatBubbleMessage>
            </ChatBubble>
          ))}

          {/* Loading */}
          {isGenerating && (
            <ChatBubble variant="received">
              <Avatar role="assistant" />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>

        <div className="w-full px-4">
          <OurChatInput onSubmit={onSubmit} input={input} setInput={setInput} disabled={disabled} />
        </div>
      </div>

      <Declaration show={hasModel} />
    </main>
  )
}

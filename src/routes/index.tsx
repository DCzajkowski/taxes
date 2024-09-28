import { InitialMessage } from '@/components/InitialMessage'
import { OurChatInput } from '@/components/OurChatInput'
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { match } from '@/helpers/check'
import { createFileRoute } from '@tanstack/react-router'
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
})

type Role = 'user' | 'assistant'
type Message = { role: Role; content: string }

function Avatar({ role }: { role: Role }) {
  return (
    <ChatBubbleAvatar
      src={match(role, {
        user: '/user.svg',
        assistant: '/ai.svg',
      })}
      className="border"
      fallback={role == 'user' ? '🙋🏼‍♂️' : '🗄️'}
    />
  )
}

function Index() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'user',
      content:
        'Wczoraj kupiłem na giełdzie samochodowej Fiata 126p rok prod. 1975, kolor zielony. Przejechane ma 1000000 km, idzie jak przecinak, nic nie stuka, nic nie puka, dosłownie igła. Zapłaciłem za niego 1000 zł ale jego wartość jest wyższa o 2000 zł i co mam z tym zrobić ?',
    },
    { role: 'assistant', content: 'hi' },
  ])

  const [isGenerating, setIsGenerating] = useState(false)

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

    setInput('')
    setMessages((messages) => [...messages, { role: 'user', content: input }])
    setIsGenerating(true)
  }

  return (
    <main className="flex h-screen w-full max-w-3xl flex-col items-center mx-auto py-6">
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
        <OurChatInput
          onSubmit={onSubmit}
          input={input}
          setInput={setInput}
          disabled={disabled}
          setIsGenerating={setIsGenerating}
        />
      </div>
    </main>
  )
}

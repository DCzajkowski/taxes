import { InitialMessage } from '@/components/InitialMessage'
import { Button } from '@/components/ui/button'
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble'
import { ChatInput } from '@/components/ui/chat/chat-input'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { match } from '@/helpers/check'
import { createFileRoute } from '@tanstack/react-router'
import { CornerDownLeft, Mic, Paperclip } from 'lucide-react'
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
        user: '/user.png',
        assistant: '/ai.svg',
      })}
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
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      if (disabled) {
        return
      }

      setIsGenerating(true)
      onSubmit(e)
    }
  }

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
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <ChatInput
            value={input}
            onKeyDown={onKeyDown}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button variant="ghost" size="icon">
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>

            <Button variant="ghost" size="icon">
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button>

            <Button disabled={disabled} type="submit" size="sm" className="ml-auto gap-1.5">
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}

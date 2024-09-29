import { chat } from '@/api'
import { Avatar } from '@/components/Avatar'
import { Declaration } from '@/components/Declaration'
import { InitialMessage } from '@/components/InitialMessage'
import { OurChatInput } from '@/components/OurChatInput'
import { ChatBubble, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useStoredState } from '@/hooks/useStoredState'
import { Message, Model } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import merge from 'lodash.merge'
import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const convIdRef = useRef(Math.random().toString())
  const [model, setModel] = useStoredState<Model | null>(null, 'taxes-model')
  const { isPending: isGenerating, mutate } = useMutation({
    mutationFn: chat,
    onSuccess(data) {
      setMessages((messages) => [...messages, { role: 'assistant', content: data.text }])
      setModel((model) => ({...merge(model, data.model)}))

      if(data.generated_xml !== null) {
        setXml(data.generated_xml)
      }
    },
  })

  const [input, setInput] = useState('')
  const [xml, setXml] = useState<string | null>(null)
  const [messages, setMessages] = useStoredState<Message[]>([], 'taxes-messages')

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
      declaration: model ?? {},
      messages: [{ role: 'user', content: input }],
    })
    setInput('')
    setMessages((messages) => [...messages, { role: 'user', content: input }])
  }


  const downloadXml =  useCallback(() => {
    if(xml === null) {
      return
    }
    // Create a Blob from the string content
    const blob = new Blob([xml], { type: 'application/xml' });
        
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = "PCC3.xml";

    // Append to body, click programmatically, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the URL object
    URL.revokeObjectURL(url);
  }, [xml])

  return (
    <main className="flex h-screen w-full max-w-7xl mx-auto py-6 gap-6">

      <Dialog open={xml !== null}>
        <DialogContent>
          <h1 className='text-3xl font-bold  mx-auto mb-6 whitespace-nowrap'>Twoja deklaracja jest gotowa!</h1>
          <button className='rounded-md px-3 py-2 bg-gov-blue text-white font-bold w-fit mx-auto' onClick={downloadXml}>
            Pobierz .xml
          </button>
        </DialogContent>
      </Dialog>


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

      <Declaration show={model !== null} model={model} setModel={setModel} />

      
    </main>
  )
}

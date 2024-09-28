import { FileButton } from '@/components/FileButton'
import { RecordButton } from '@/components/RecordButton'
import { Button } from '@/components/ui/button'
import { ChatInput } from '@/components/ui/chat/chat-input'
import { CornerDownLeft } from 'lucide-react'
import { Dispatch, FormEvent, KeyboardEvent, SetStateAction, useRef } from 'react'

export function OurChatInput({
  onSubmit,
  input,
  setInput,
  disabled,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => void
  input: string
  setInput: Dispatch<SetStateAction<string>>
  disabled: boolean
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      if (disabled) {
        return
      }

      onSubmit(e)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
    >
      <ChatInput
        ref={inputRef}
        value={input}
        onKeyDown={onKeyDown}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Zadaj pytanie..."
        className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center p-3 pt-0">
        <RecordButton
          onSuccess={(text) => {
            setInput((prev) => prev + text.trim())
            inputRef.current?.focus()
          }}
        />

        <FileButton
          onSuccess={(text) => {
            setInput((prev) => prev + text.trim())
            inputRef.current?.focus()
          }}
        />

        <Button disabled={disabled} type="submit" size="sm" className="ml-auto gap-1.5">
          Wyślij wiadomość
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </form>
  )
}

import { transcribe } from '@/api'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { Mic } from 'lucide-react'
import { useRef, useState } from 'react'

type Props = {
  onSuccess: (text: string) => void
}

export function RecordButton({ onSuccess }: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: transcribe,
    onSuccess(data) {
      onSuccess(data.text)
    },
  })

  const [isRecording, setIsRecording] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])

  const start = async () => {
    if (mediaRecorderRef.current === null) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch((e: Error) => e)
      if (stream instanceof Error) {
        console.error(stream)
        setIsRecording(false)
        alert('Wystąpił problem przy nagrywaniu. Spróbuj ponownie.')
        setIsRecording(false)
        return
      }

      mediaRecorderRef.current = new MediaRecorder(stream)
    }

    setIsRecording(true)

    const mediaRecorder = mediaRecorderRef.current

    mediaRecorder.ondataavailable = (event) => {
      chunks.current.push(event.data)
    }

    mediaRecorder.start()
  }

  const stop = () => {
    if (mediaRecorderRef.current === null) {
      return
    }

    const mediaRecorder = mediaRecorderRef.current

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: mediaRecorder.mimeType })
      const file = new File([blob], 'recording.webm', { type: mediaRecorder.mimeType })

      mutate(file)

      chunks.current = []
    }
    setIsRecording(false)
    mediaRecorder.stop()
  }

  const onClick = () => {
    if (!isRecording) {
      start()
    } else {
      stop()
    }
  }

  const supportsRecording = navigator.mediaDevices.getUserMedia !== undefined

  return (
    <Button
      variant="ghost"
      className={cn({
        'bg-red-700 hover:bg-red-800 hover:text-white text-white': isRecording,
      })}
      size="icon"
      onClick={onClick}
      disabled={!supportsRecording}
      type="button"
    >
      {isPending ? (
        <div className="size-4 border-2 border-gray-500 border-r-transparent rounded-full animate-spin" />
      ) : (
        <Mic
          className={cn({
            'animate-pulse': isRecording,
            'size-4': true,
          })}
        />
      )}

      <span className="sr-only">Użyj mikrofonu</span>
    </Button>
  )
}

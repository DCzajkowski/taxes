import { upload } from '@/api'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { Paperclip } from 'lucide-react'
import { ChangeEvent, useRef } from 'react'

type Props = {
  onSuccess: (text: string) => void
}

export function FileButton({ onSuccess }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: upload,
    onSuccess(data) {
      onSuccess(data.text)
    },
  })

  const onClick = () => {
    fileRef.current?.click()
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target.files ?? []
    if (file === undefined) {
      return
    }

    console.log(file)

    mutate(file)
  }

  return (
    <>
      <input type="file" ref={fileRef} className="peer sr-only" name="file" onChange={onChange} multiple={false} />

      <Button variant="ghost" size="icon" onClick={onClick} type="button">
        {isPending ? (
          <div className="size-4 border-2 border-gray-500 border-r-transparent rounded-full animate-spin" />
        ) : (
          <Paperclip className="size-4" />
        )}

        <span className="sr-only">Dodaj plik</span>
      </Button>
    </>
  )
}

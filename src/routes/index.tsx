import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const prompt = formData.get('prompt') as string

    console.log(prompt)
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <form onSubmit={onSubmit}>
        <input type="text" name="prompt" />
        <button>submit</button>
      </form>
    </div>
  )
}

import { z } from 'zod'

type ChatRequest = {
  messages: Array<{
    role: 'user'
    content: string
  }>
}

const chatResponseSchema = z.object({
  response: z.string(),
  declaration: z.record(z.unknown()),
})

type ChatResponse = z.infer<typeof chatResponseSchema>

type SuccessChatResponse = {
  text: string
  model: Record<string, unknown>
}

export async function chat(request: ChatRequest): Promise<SuccessChatResponse> {
  const endpoint = import.meta.env.VITE_PUBLIC_API_CHAT_ENDPOINT
  if (endpoint === undefined) {
    throw new Error('Missing VITE_PUBLIC_API_CHAT_ENDPOINT')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
  if (!response.ok) {
    console.error(response)

    throw new Error(`Request failed with status ${response.status}`)
  }

  const json = await response.json()
  const data = chatResponseSchema.parse(json)

  return {
    text: data.response,
    model: data.declaration,
  }
}

const transcribeResponseSchema = z.object({
  transcription: z.string(),
})

type TranscribeResponse = z.infer<typeof transcribeResponseSchema>

type SuccessTranscribeResponse = {
  text: string
}

export async function transcribe(file: File): Promise<SuccessTranscribeResponse> {
  const endpoint = import.meta.env.VITE_PUBLIC_API_TRANSCRIBE_ENDPOINT
  if (endpoint === undefined) {
    throw new Error('Missing VITE_PUBLIC_API_TRANSCRIBE_ENDPOINT')
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) {
    console.error(response)

    throw new Error(`Request failed with status ${response.status}`)
  }

  const json = await response.json()
  const data = transcribeResponseSchema.parse(json)

  return {
    text: data.transcription,
  }
}

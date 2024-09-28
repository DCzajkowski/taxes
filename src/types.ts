export type Role = 'user' | 'assistant'
export type Message = { role: Role; content: string }

export type Model = Record<string, unknown>

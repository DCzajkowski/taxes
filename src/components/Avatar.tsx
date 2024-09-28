import { ChatBubbleAvatar } from '@/components/ui/chat/chat-bubble'
import { match } from '@/helpers/check'
import { Role } from '@/types'

export function Avatar({ role }: { role: Role }) {
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

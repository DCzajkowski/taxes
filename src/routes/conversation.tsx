import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/conversation')({
  component: () => <div>Hello /conversation!</div>,
})

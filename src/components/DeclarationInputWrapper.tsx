import { Label } from '@/components/ui/label'
import { ReactNode } from 'react'

type Props = {
  label: string
  children: ReactNode
}

export function DeclarationInputWrapper({ label, children }: Props) {
  return (
    <div className="mt-4 px-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

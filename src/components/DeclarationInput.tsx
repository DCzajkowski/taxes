import { DeclarationInputWrapper } from '@/components/DeclarationInputWrapper'
import { Input } from '@/components/ui/input'

type Props = {
  label: string
  value: string
  setValue: (value: string) => void
}

export function DeclarationInput({ label, value, setValue }: Props) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)

    setValue(e.target.value)
  }

  return (
    <DeclarationInputWrapper label={label}>
      <Input placeholder="" value={value} onChange={onChange} className="bg-white " />
    </DeclarationInputWrapper>
  )
}

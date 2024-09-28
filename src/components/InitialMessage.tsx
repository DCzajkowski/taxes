export function InitialMessage() {
  return (
    <div className="w-full bg-background shadow-sm border rounded-lg p-8 flex flex-col gap-2">
      <h1 className="font-bold">Witamy w rozmowie z Wirtualnym Asystentem podatkowym</h1>
      <p className="text-muted-foreground text-sm">
        Opisz mi sytuację, w jakiej się znalazłeś/aś, a ja postaram się pomóc wskazując jaki wniosek podatkowy
        powinieneś/aś uzupełnić.
      </p>
    </div>
  )
}

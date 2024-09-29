import { DeclarationInput } from '@/components/DeclarationInput'
import { DeclarationInputWrapper } from '@/components/DeclarationInputWrapper'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { match } from '@/helpers/check'
import { noop } from '@/helpers/function'
import { cloneDeep } from '@/helpers/object'
import {
  CelZlozenia,
  MiejscePolozenia,
  Model,
  PodmiotSkladajacy,
  PrzedmiotOpodatkowania,
  RodzajCzynnosci,
  TypSpolki,
} from '@/types'
import { motion } from 'framer-motion'
import { set } from 'lodash'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type Props = {
  show: boolean
  model: Model | null
  setModel: Dispatch<SetStateAction<Model | null>>
}

export function Declaration({ show, model, setModel }: Props) {
  return (
    <motion.div
      className="overflow-hidden bg-white rounded-md"
      initial={false}
      variants={{
        show: { width: '32rem' },
        hide: { width: '0' },
      }}
      animate={show ? 'show' : 'hide'}
    >
      {model !== null && <DeclarationContent model={model} setModel={setModel} />}
    </motion.div>
  )
}

function DeclarationContent({ model, setModel }: { model: Model; setModel: Dispatch<SetStateAction<Model | null>> }) {
  const setter = (path: string) => (value: string | number) => {
    setModel((model) => {
      if (model === null) {
        throw new Error('Model is null')
      }

      return set(cloneDeep(model), path, value)
    })
  }

  const [rodzajPodatnika, setRodzajPodatnika] = useState<'fizyczna' | 'nie-fizyczna' | ''>('')
  useEffect(() => {
    setRodzajPodatnika(old => {
      if (old !== '') {
        return old
      }

      if(model.sekcja_b?.osoba_fizyczna !== null) {
        return 'fizyczna'
      }
  
      if(model.sekcja_b?.osoba_niefizyczna !== null) {
        return 'nie-fizyczna'
      }

      return old
    })
  }, [model.sekcja_b?.osoba_fizyczna,model.sekcja_b?.osoba_niefizyczna ])

  const [identyfikator, setIdentyfikator] = useState<'nip' | 'pesel' | ''>('')
  useEffect(() => {
    setIdentyfikator(old => {
      if (old !== '') {
        return old
      }

      if(model.sekcja_b?.osoba_fizyczna?.pesel !== null) {
        return 'pesel'
      }
  
      if(model.sekcja_b?.osoba_fizyczna?.nip !== null) {
        return 'nip'
      }

      return old
    })
  }, [model.sekcja_b?.osoba_fizyczna?.nip, model.sekcja_b?.osoba_fizyczna?.pesel ])

  const [rodzajCzynnosci, setRodzajCzynnosci] = useState<string>('')

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-semibold text-gov-blue">Deklaracja PCC-3</h2>

      <Accordion type="single" defaultValue="sekcja_a" collapsible className="mt-4">
        <AccordionItem value="sekcja_a">
          <AccordionTrigger className="text-left font-bold">A. Okres, miejsce i cel składania deklaracji</AccordionTrigger>
          <AccordionContent className="pb-6">
            <DeclarationInput
              label="Data dokonania czynności"
              value={model.sekcja_a?.data_dokonania_czynnosci ?? ''}
              setValue={setter('sekcja_a.data_dokonania_czynnosci')}
            />
            <DeclarationInput
              label="Urząd, do którego jest adresowana deklaracja"
              value={model.sekcja_a?.kod_urzedu ?? ''}
              setValue={setter('sekcja_a.kod_urzedu')}
            />
            <DeclarationInputWrapper label="Cel złożenia deklaracji">
              <Select defaultValue={String(CelZlozenia.ZLOZENIE)} disabled>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(CelZlozenia.ZLOZENIE)}>Złożenie deklaracji</SelectItem>
                  <SelectItem value={String(CelZlozenia.KOREKTA)}>Korekta deklaracji</SelectItem>
                </SelectContent>
              </Select>
            </DeclarationInputWrapper>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="sekcja_b">
          <AccordionTrigger className="text-left font-bold">B. Dane podatnika</AccordionTrigger>
          <AccordionContent className="pb-6">
            <DeclarationInputWrapper label="Podmiot składający deklarację">
              <Select
                value={String(model.sekcja_b?.podmiot_skladajacy ?? '')}
                onValueChange={(value) => setter('sekcja_b.podmiot_skladajacy')(Number(value))}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(PodmiotSkladajacy.PODMIOT_ZOBOWIAZANY)}>
                    Podmiot zobowiązany solidarnie do zapłaty podatku
                  </SelectItem>
                  <SelectItem value={String(PodmiotSkladajacy.STRONA_UMOWY_ZAMIANY)}>Strona umowy zamiany</SelectItem>
                  <SelectItem value={String(PodmiotSkladajacy.WSPOLNIK_SPOLKI_CYWILNEJ)}>
                    Wspólnik spółki cywilnej
                  </SelectItem>
                  <SelectItem value={String(PodmiotSkladajacy.POZYCZKOBIORCA)}>
                    Podmiot, o którym mowa w art. 9 pkt 10 lit. b ustawy (pożyczkobiorca)
                  </SelectItem>
                  <SelectItem value={String(PodmiotSkladajacy.INNY_PODMIOT)}>Inny podmiot</SelectItem>
                </SelectContent>
              </Select>
            </DeclarationInputWrapper>

            <DeclarationInputWrapper label="Rodzaj podatnika">
              <Select
                value={rodzajPodatnika}
                onValueChange={(value) => setRodzajPodatnika(value as 'fizyczna' | 'nie-fizyczna' | '')}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fizyczna">Osoba fizyczna</SelectItem>
                  <SelectItem value="nie-fizyczna">Podatnik niebędący osobą fizyczną</SelectItem>
                </SelectContent>
              </Select>
            </DeclarationInputWrapper>

            {match(rodzajPodatnika, {
              'nie-fizyczna': (
                <>
                  <hr className="mt-4" />

                  <DeclarationInput
                    label="Identyfikator podatkowy NIP"
                    value={model.sekcja_b?.osoba_niefizyczna?.nip ?? ''}
                    setValue={setter('sekcja_b.osoba_niefizyczna.nip')}
                  />
                  <DeclarationInput
                    label="Nazwa pełna"
                    value={model.sekcja_b?.osoba_niefizyczna?.pelna_nazwa ?? ''}
                    setValue={setter('sekcja_b.osoba_niefizyczna.pelna_nazwa')}
                  />
                  <DeclarationInput
                    label="Nazwa skrócona"
                    value={model.sekcja_b?.osoba_niefizyczna?.skrocona_nazwa ?? ''}
                    setValue={setter('sekcja_b.osoba_niefizyczna.skrocona_nazwa')}
                  />
                </>
              ),
              fizyczna: (
                <>
                  <hr className="mt-4" />

                  <DeclarationInputWrapper label="Identyfikator podatkowy">
                    <Select
                      value={identyfikator}
                      onValueChange={(value) => setIdentyfikator(value as 'nip' | 'pesel' | '')}
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pesel">PESEL</SelectItem>
                        <SelectItem value="nip">NIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </DeclarationInputWrapper>

                  {match(identyfikator, {
                    nip: (
                      <DeclarationInput
                        label="Identyfikator podatkowy NIP"
                        value={model.sekcja_b?.osoba_fizyczna?.nip ?? ''}
                        setValue={setter('sekcja_b.osoba_fizyczna.nip')}
                      />
                    ),
                    pesel: (
                      <DeclarationInput
                        label="Identyfikator numer PESEL"
                        value={model.sekcja_b?.osoba_fizyczna?.pesel ?? ''}
                        setValue={setter('sekcja_b.osoba_fizyczna.pesel')}
                      />
                    ),
                    '': <></>,
                  })}

                  <DeclarationInput
                    label="Pierwsze imię"
                    value={model.sekcja_b?.osoba_fizyczna?.imie_pierwsze ?? ''}
                    setValue={setter('sekcja_b.osoba_fizyczna.imie_pierwsze')}
                  />
                  <DeclarationInput
                    label="Nazwisko"
                    value={model.sekcja_b?.osoba_fizyczna?.nazwisko ?? ''}
                    setValue={setter('sekcja_b.osoba_fizyczna.nazwisko')}
                  />
                  <DeclarationInput
                    label="Data urodzenia"
                    value={model.sekcja_b?.osoba_fizyczna?.data_urodzenia ?? ''}
                    setValue={setter('sekcja_b.osoba_fizyczna.data_urodzenia')}
                  />
                  <DeclarationInput
                    label="Imię ojca (opcjonalnie)"
                    value={model.sekcja_b?.osoba_fizyczna?.imie_ojca ?? ''}
                    setValue={setter('sekcja_b.osoba_fizyczna.imie_ojca')}
                  />
                  <DeclarationInput
                    label="Imię matki (opcjonalnie)"
                    value={model.sekcja_b?.osoba_fizyczna?.imie_matki ?? ''}
                    setValue={setter('sekcja_b.osoba_fizyczna.imie_matki')}
                  />
                </>
              ),
              '': <></>,
            })}

            {rodzajPodatnika !== '' && (
              <>
                <hr className="mt-4" />

                <DeclarationInput
                  label="Kraj"
                  value={model.sekcja_b?.adres_zamieszkania_siedziby?.kod_kraju ?? ''}
                  setValue={setter('sekcja_b.adres_zamieszkania_siedziby.kod_kraju')}
                />
                <DeclarationInput
                  label="Województwo"
                  value={model.sekcja_b?.adres_zamieszkania_siedziby?.wojewodztwo ?? ''}
                  setValue={setter('sekcja_b.adres_zamieszkania_siedziby.wojewodztwo')}
                />
                <DeclarationInput
                  label="Powiat"
                  value={model.sekcja_b?.adres_zamieszkania_siedziby?.powiat ?? ''}
                  setValue={setter('sekcja_b.adres_zamieszkania_siedziby.powiat')}
                />
                <DeclarationInput
                  label="Gmina"
                  value={model.sekcja_b?.adres_zamieszkania_siedziby?.gmina ?? ''}
                  setValue={setter('sekcja_b.adres_zamieszkania_siedziby.gmina')}
                />
                <DeclarationInput
                  label="Miejscowość"
                  value={model.sekcja_b?.adres_zamieszkania_siedziby?.miejscowosc ?? ''}
                  setValue={setter('sekcja_b.adres_zamieszkania_siedziby.miejscowosc')}
                />
                <DeclarationInput
                  label="Ulica (opcjonalnie)"
                  value={model.sekcja_b?.adres_zamieszkania_siedziby?.ulica ?? ''}
                  setValue={setter('sekcja_b.adres_zamieszkania_siedziby.ulica')}
                />
                <DeclarationInput
                  label="Numer domu"
                  value={model.sekcja_b?.adres_zamieszkania_siedziby?.nr_domu ?? ''}
                  setValue={setter('sekcja_b.adres_zamieszkania_siedziby.nr_domu')}
                />
                <DeclarationInput
                  label="Numer lokalu (opcjonalnie)"
                  value={model.sekcja_b?.adres_zamieszkania_siedziby?.nr_lokalu ?? ''}
                  setValue={setter('sekcja_b.adres_zamieszkania_siedziby.nr_lokalu')}
                />
                <DeclarationInput
                  label="Kod pocztowy"
                  value={model.sekcja_b?.adres_zamieszkania_siedziby?.kod_pocztowy ?? ''}
                  setValue={setter('sekcja_b.adres_zamieszkania_siedziby.kod_pocztowy')}
                />
              </>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="sekcja_c">
          <AccordionTrigger className="text-left font-bold">C. Przedmiot opodatkowania</AccordionTrigger>
          <AccordionContent className="pb-6">
            <DeclarationInputWrapper label="Podmiot składający deklarację">
              <Select
                value={String(model.sekcja_c?.przedmiot_opodatkowania ?? '')}
                onValueChange={(value) => setter('sekcja_c.przedmiot_opodatkowania')(Number(value))}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(PrzedmiotOpodatkowania.UMOWA)}>Umowa</SelectItem>
                  <SelectItem value={String(PrzedmiotOpodatkowania.ZMIANA_UMOWY)}>Zmiana umowy</SelectItem>
                  <SelectItem value={String(PrzedmiotOpodatkowania.ORZECZENIE_SADU_LUB_UGODA)}>
                    Orzeczenie sądu lub ugoda
                  </SelectItem>
                  <SelectItem value={String(PrzedmiotOpodatkowania.INNE)}>Inne</SelectItem>
                </SelectContent>
              </Select>
            </DeclarationInputWrapper>

            <DeclarationInputWrapper label="Miejsce położenia rzeczy lub miejsce wykonywania prawa majątkowego">
              <Select
                value={String(model.sekcja_c?.miejsce_polozenia ?? '')}
                onValueChange={(value) => setter('sekcja_c.miejsce_polozenia')(Number(value))}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(MiejscePolozenia.TERYTORIUM_RP)}>Terytorium RP</SelectItem>
                  <SelectItem value={String(MiejscePolozenia.POZA_TERYTORIUM_RP)}>Poza terytorium RP</SelectItem>
                </SelectContent>
              </Select>
            </DeclarationInputWrapper>

            <DeclarationInputWrapper label="Miejsce dokonania czynności cywilnoprawnej">
              <Select
                value={String(model.sekcja_c?.miejsce_dokonania_czynnosci ?? '')}
                onValueChange={(value) => setter('sekcja_c.miejsce_dokonania_czynnosci')(Number(value))}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(MiejscePolozenia.TERYTORIUM_RP)}>Terytorium RP</SelectItem>
                  <SelectItem value={String(MiejscePolozenia.POZA_TERYTORIUM_RP)}>Poza terytorium RP</SelectItem>
                </SelectContent>
              </Select>
            </DeclarationInputWrapper>

            <DeclarationInputWrapper label="Zwięzłe określenie treści i przedmiotu czynności cywilnoprawnej">
              <Textarea
                className="bg-white"
                value={model.sekcja_c?.tresc_czynnosci ?? ''}
                onChange={(e) => setter('sekcja_c.tresc_czynnosci')(e.target.value)}
              />
            </DeclarationInputWrapper>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="sekcja_d">
          <AccordionTrigger className="text-left font-bold">D. Obliczenie podatku od czynności cywilnoprawnych</AccordionTrigger>
          <AccordionContent className="pb-6">
            <DeclarationInputWrapper label="Rodzaj czynności cywilnoprawnej">
              <Select value={rodzajCzynnosci} onValueChange={(value) => setRodzajCzynnosci(value)}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(RodzajCzynnosci.UMOWA_SPRZEDAZY)}>Umowa sprzedaży</SelectItem>
                  <SelectItem value={String(RodzajCzynnosci.UMOWA_ZAMIANY)}>Umowa zamiany</SelectItem>
                  <SelectItem value={String(RodzajCzynnosci.UMOWA_POZYCZKI)}>
                    Umowa pożyczki lub depozytu nieprawidłowego, w tym zwolniona na podstawie art. 9 pkt 10 lit.b ustawy
                  </SelectItem>
                  <SelectItem value={String(RodzajCzynnosci.UMOWA_DAROWIZNY)}>
                    Umowa darowizny w części dotyczącej przejęcia przez obdarowanego długów i ciężarów lub zobowiązań
                    darczyńcy
                  </SelectItem>
                  <SelectItem value={String(RodzajCzynnosci.USTANOWIENIE_ODPŁATNEGO_UZYTKOWANIA)}>
                    Ustanowienie odpłatnego użytkowania, w tym nieprawidłowego
                  </SelectItem>
                  <SelectItem value={String(RodzajCzynnosci.WIERZYTELNOSC_ISTNIEJACA)}>
                    Ustanowienie hipoteki na zabezpieczenie wierzytelności istniejących
                  </SelectItem>
                  <SelectItem value={String(RodzajCzynnosci.WIERZYTELNOSC_O_WYSOKOSCI_NIEUSTALONEJ)}>
                    Ustanowienie hipoteki na zabezpieczenie wierzytelności o wysokości nieustalonej
                  </SelectItem>
                  <SelectItem value={String(RodzajCzynnosci.INNA_CZYNNOSC)}>Inna czynność</SelectItem>
                </SelectContent>
              </Select>
            </DeclarationInputWrapper>

            {match(rodzajCzynnosci, {
              [RodzajCzynnosci.UMOWA_SPRZEDAZY]: (
                <>
                  <DeclarationInput
                    label="Umowa sprzedaży (stawka podatku 1%) - podstawa opodatkowania określona zgodnie z art. 6 ustawy zł"
                    value={String(model.sekcja_d?.podstawa_opodatkowania_1 ?? '')}
                    setValue={(value) => setter('sekcja_d.podstawa_opodatkowania_1')(Number(value))}
                  />
                  <DeclarationInput
                    label="Umowa sprzedaży (stawka podatku 1%) - obliczony należny podatek zł"
                    value={String(model.sekcja_d?.kwota_podatku_1 ?? '')}
                    setValue={(value) => setter('sekcja_d.kwota_podatku_1')(Number(value))}
                  />
                  <DeclarationInput
                    label="Umowa sprzedaży (stawka podatku 2%) - podstawa opodatkowania określona zgodnie z art. 6 ustawy zł"
                    value={String(model.sekcja_d?.podstawa_opodatkowania_2 ?? '')}
                    setValue={(value) => setter('sekcja_d.podstawa_opodatkowania_2')(Number(value))}
                  />
                  <DeclarationInput
                    label="Umowa sprzedaży (stawka podatku 2%) - obliczony należny podatek zł"
                    value={String(model.sekcja_d?.kwota_podatku_2 ?? '')}
                    setValue={(value) => setter('sekcja_d.kwota_podatku_2')(Number(value))}
                  />
                </>
              ),
              '': <></>,
              default: <div className="mx-2 mt-4 italic">Niewspierana wartość</div>,
            })}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="sekcja_e">
          <AccordionTrigger className="text-left font-bold">E. Obliczenie podatku od umowy spółki</AccordionTrigger>
          <AccordionContent className="pb-6">
            <DeclarationInputWrapper label="Typ spółki">
              <Select
                value={String(model.sekcja_e?.typ_spolki ?? '')}
                onValueChange={(value) => setter('sekcja_e.typ_spolki')(Number(value))}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(TypSpolki.OSOBOWA)}>Spółka osobowa</SelectItem>
                  <SelectItem value={String(TypSpolki.KAPITALOWA)}>Spółka kapitałowa </SelectItem>
                </SelectContent>
              </Select>
            </DeclarationInputWrapper>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="sekcja_f">
          <AccordionTrigger className="text-left font-bold">F. Podatek do zapłaty</AccordionTrigger>
          <AccordionContent className="pb-6">
            <DeclarationInputWrapper label="Kwota podatku do zapłaty">
              <Input
                placeholder=""
                value={String(model.sekcja_f?.kwota_podatku_do_zaplaty ?? '')}
                onChange={noop}
                disabled
              />
            </DeclarationInputWrapper>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="sekcja_g">
          <AccordionTrigger className="text-left font-bold">G. Informacje dodatkowe </AccordionTrigger>
          <AccordionContent className="pb-6">
            <DeclarationInput
              label="Województwo"
              value={model.sekcja_g?.wojewodztwo ?? ''}
              setValue={setter('sekcja_g.wojewodztwo')}
            />
            <DeclarationInput
              label="Powiat"
              value={model.sekcja_g?.powiat ?? ''}
              setValue={setter('sekcja_g.powiat')}
            />
            <DeclarationInput label="Gmina" value={model.sekcja_g?.gmina ?? ''} setValue={setter('sekcja_g.gmina')} />
            <DeclarationInput
              label="Miejscowość"
              value={model.sekcja_g?.miejscowosc ?? ''}
              setValue={setter('sekcja_g.miejscowosc')}
            />
            <DeclarationInput label="Ulica" value={model.sekcja_g?.ulica ?? ''} setValue={setter('sekcja_g.ulica')} />
            <DeclarationInput
              label="Numer domu"
              value={model.sekcja_g?.nr_domu ?? ''}
              setValue={setter('sekcja_g.nr_domu')}
            />
            <DeclarationInput
              label="Numer lokalu"
              value={model.sekcja_g?.nr_lokalu ?? ''}
              setValue={setter('sekcja_g.nr_lokalu')}
            />
            <DeclarationInput
              label="Kod pocztowy"
              value={model.sekcja_g?.kod_pocztowy ?? ''}
              setValue={setter('sekcja_g.kod_pocztowy')}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

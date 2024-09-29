export type Role = 'user' | 'assistant'
export type Message = { role: Role; content: string }

/*
 * Model
 */

export const CelZlozenia = {
  ZLOZENIE: 1,
  KOREKTA: 2,
}

export const PodmiotSkladajacy = {
  PODMIOT_ZOBOWIAZANY: 1,
  STRONA_UMOWY_ZAMIANY: 2,
  WSPOLNIK_SPOLKI_CYWILNEJ: 3,
  POZYCZKOBIORCA: 4,
  INNY_PODMIOT: 5,
}

export const PrzedmiotOpodatkowania = {
  UMOWA: 1,
  ZMIANA_UMOWY: 2,
  ORZECZENIE_SADU_LUB_UGODA: 3,
  INNE: 4,
}

export const MiejscePolozenia = {
  TERYTORIUM_RP: 1,
  POZA_TERYTORIUM_RP: 2,
}

export const TypSpolki = {
  OSOBOWA: 1,
  KAPITALOWA: 2,
}

export const PodstawaOpodatkowania = {
  ZAWARCIE_UMOWY_SPOLKI: 1,
  ZWIEKSZENIE_MAJATKU_SPOLKI: 2,
  DOPLATA: 3,
  POZYCZKA_UDZIELONA_SPOLCE: 4,
  ODDANIE_RZECZY_DO_UZYWANIA: 5,
  PRZEKSZTALCENIE_SPOLEK: 6,
  LACZENIE_SPOLEK: 7,
  PRZENIESIENIE_SIEDZIBY: 8,
}

export const RodzajCzynnosci = {
  UMOWA_SPRZEDAZY: 1,
  UMOWA_ZAMIANY: 2,
  UMOWA_POZYCZKI: 3,
  UMOWA_DAROWIZNY: 4,
  USTANOWIENIE_ODPŁATNEGO_UZYTKOWANIA: 5,
  WIERZYTELNOSC_ISTNIEJACA: 6,
  WIERZYTELNOSC_O_WYSOKOSCI_NIEUSTALONEJ: 7,
  INNA_CZYNNOSC: 8,
}

type PartialSectionA = {
  kod_formularza?: 'PCC-3'
  wariant_formularza?: 6
  cel_zlozenia?: (typeof CelZlozenia)[keyof typeof CelZlozenia]
  data_dokonania_czynnosci?: string
  kod_urzedu?: string
  is_complete: boolean
}

type PartialAdres = {
  kod_kraju?: string
  wojewodztwo?: string
  powiat?: string
  gmina?: string
  ulica?: string
  nr_domu?: string
  nr_lokalu?: string
  miejscowosc?: string
  kod_pocztowy?: string
}

type PartialOsobaFizyczna = {
  nip?: string
  pesel?: string
  imie_pierwsze?: string
  nazwisko?: string
  data_urodzenia?: string
  imie_ojca?: string
  imie_matki?: string
}

type PartialOsobaNiefizyczna = {
  nip?: string
  pelna_nazwa?: string
  skrocona_nazwa?: string
}

type PartialSectionB = {
  osoba_fizyczna?: PartialOsobaFizyczna
  osoba_niefizyczna?: PartialOsobaNiefizyczna
  adres_zamieszkania_siedziby?: PartialAdres
  podmiot_skladajacy?: (typeof PodmiotSkladajacy)[keyof typeof PodmiotSkladajacy]
  is_complete: boolean
}

type PartialSectionC = {
  przedmiot_opodatkowania?: (typeof PrzedmiotOpodatkowania)[keyof typeof PrzedmiotOpodatkowania]
  miejsce_polozenia?: (typeof MiejscePolozenia)[keyof typeof MiejscePolozenia]
  miejsce_dokonania_czynnosci?: (typeof MiejscePolozenia)[keyof typeof MiejscePolozenia]
  tresc_czynnosci?: string
  is_complete: boolean
}

type PartialSectionD = {
  podstawa_opodatkowania_1?: number
  kwota_podatku_1?: number
  podstawa_opodatkowania_2?: number
  kwota_podatku_2?: number
  podstawa_opodatkowania_zamiana?: number
  stawka_podatku_zamiana?: number
  kwota_podatku_zamiana?: number
  podstawa_opodatkowania_pozyczka?: number
  stawka_podatku_pozyczka?: number
  kwota_podatku_pozyczka?: number
  podstawa_opodatkowania_darowizna?: number
  stawka_podatku_darowizna?: number
  kwota_podatku_darowizna?: number
  podstawa_opodatkowania_uzytkowanie?: number
  stawka_podatku_uzytkowanie?: number
  kwota_podatku_uzytkowanie?: number
  podstawa_opodatkowania_hipoteka?: number
  kwota_podatku_hipoteka?: number
  kwota_podatku_hipoteka_nieustalona?: number
  rodzaj_czynnosci_innej?: string
  podstawa_opodatkowania_inna?: number
  stawka_podatku_inna?: number
  kwota_podatku_inna?: number
  kwota_podatku_naleznego?: number
  is_complete: boolean
}

type PartialSectionE = {
  typ_spolki?: (typeof TypSpolki)[keyof typeof TypSpolki]
  podstawa_opodatkowania?: (typeof PodstawaOpodatkowania)[keyof typeof PodstawaOpodatkowania]
  kwota_podstawy_opodatkowania?: number
  koszty?: number
  podstawa_obliczenia_podatku?: number
  kwota_podatku?: number
  is_complete: boolean
}

type PartialSectionF = {
  kwota_podatku_do_zaplaty?: number
  is_complete: boolean
}

type PartialSectionG = {
  wojewodztwo?: string
  powiat?: string
  gmina?: string
  ulica?: string
  nr_domu?: string
  nr_lokalu?: string
  miejscowosc?: string
  kod_pocztowy?: string
  is_complete: boolean
}

type PartialSectionH = {
  liczba_zalacznikow?: number
  is_complete: boolean
}

type PartialDeklaracja = {
  sekcja_a?: PartialSectionA
  sekcja_b?: PartialSectionB
  sekcja_c?: PartialSectionC
  sekcja_d?: PartialSectionD
  sekcja_e?: PartialSectionE
  sekcja_f?: PartialSectionF
  sekcja_g?: PartialSectionG
  sekcja_h?: PartialSectionH
  // pouczenia?: number
}

export type Model = PartialDeklaracja

export type Role = 'user' | 'assistant'
export type Message = { role: Role; content: string }

/*
 * Model
 */

export const CelZlozenia = {
  ZLOZENIE: 'ZLOZENIE',
  KOREKTA: 'KOREKTA',
}

export const PodmiotSkladajacy = {
  PODMIOT_ZOBOWIAZANY:"PODMIOT_ZOBOWIAZANY",
  STRONA_UMOWY_ZAMIANY:"STRONA_UMOWY_ZAMIANY",
  WSPOLNIK_SPOLKI_CYWILNEJ:"WSPOLNIK_SPOLKI_CYWILNEJ",
  POZYCZKOBIORCA:"POZYCZKOBIORCA",
  INNY_PODMIOT:"INNY_PODMIOT",
}

export const PrzedmiotOpodatkowania = {
  UMOWA: "UMOWA",
  ZMIANA_UMOWY: "ZMIANA_UMOWY",
  ORZECZENIE_SADU_LUB_UGODA: "ORZECZENIE_SADU_LUB_UGODA",
  INNE: "INNE",
}

export const MiejscePolozenia = {
  TERYTORIUM_RP: "TERYTORIUM_RP",
  POZA_TERYTORIUM_RP: "POZA_TERYTORIUM_RP",
}

export const TypSpolki = {
  OSOBOWA: "OSOBOWA",
  KAPITALOWA: "KAPITALOWA",
}

export const PodstawaOpodatkowania = {
  ZAWARCIE_UMOWY_SPOLKI: "ZAWARCIE_UMOWY_SPOLKI",
  ZWIEKSZENIE_MAJATKU_SPOLKI: "ZWIEKSZENIE_MAJATKU_SPOLKI",
  DOPLATA: "DOPLATA",
  POZYCZKA_UDZIELONA_SPOLCE: "POZYCZKA_UDZIELONA_SPOLCE",
  ODDANIE_RZECZY_DO_UZYWANIA: "ODDANIE_RZECZY_DO_UZYWANIA",
  PRZEKSZTALCENIE_SPOLEK: "PRZEKSZTALCENIE_SPOLEK",
  LACZENIE_SPOLEK: "LACZENIE_SPOLEK",
  PRZENIESIENIE_SIEDZIBY: "PRZENIESIENIE_SIEDZIBY",
}

export const RodzajCzynnosci = {
  UMOWA_SPRZEDAZY: "UMOWA_SPRZEDAZY",
  UMOWA_ZAMIANY: "UMOWA_ZAMIANY",
  UMOWA_POZYCZKI: "UMOWA_POZYCZKI",
  UMOWA_DAROWIZNY: "UMOWA_DAROWIZNY",
  USTANOWIENIE_ODPŁATNEGO_UZYTKOWANIA: "USTANOWIENIE_ODPŁATNEGO_UZYTKOWANIA",
  WIERZYTELNOSC_ISTNIEJACA: "WIERZYTELNOSC_ISTNIEJACA",
  WIERZYTELNOSC_O_WYSOKOSCI_NIEUSTALONEJ: "WIERZYTELNOSC_O_WYSOKOSCI_NIEUSTALONEJ",
  INNA_CZYNNOSC: "INNA_CZYNNOSC",
}

type PartialSectionA = {
  kod_formularza?: 'PCC-3'
  wariant_formularza?: 6
  cel_zlozenia?: (typeof CelZlozenia)[keyof typeof CelZlozenia]
  data_dokonania_czynnosci?: string
  nazwa_urzedu?: string
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
  podstawa_opodatkowania: number
  kwota_podatku: number
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

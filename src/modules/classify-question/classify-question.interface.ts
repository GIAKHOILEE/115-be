export interface IClassifyQuestion {
  protocol_code: number
  name: {
    vi: string
    en: string
  }
  questions: IQuestion[]
}
export interface IQuestion {
  id: number
  question: string
  multiple_choice: boolean | false
  answer: IAnswer[]
}
export interface IAnswer {
  option: string
  value: string
  level: 'Green' | 'Yellow' | 'Red' | 'Purple' | 'Orange' | 'Blue'
  change_protocol: number | null
}

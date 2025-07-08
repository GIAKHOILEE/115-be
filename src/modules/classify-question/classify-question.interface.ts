import { RecordLevel } from 'src/constants/record-level.enum'

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
  multiple_choice?: boolean | false
  answer: IAnswer[]
}
export interface IAnswer {
  id: number
  option: string
  value: string
  level: RecordLevel
  change_protocol: number | null
  priority: number
}

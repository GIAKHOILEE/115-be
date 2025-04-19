import { IQuestion } from '../classify-question/classify-question.interface'

export interface IProtocol {
  id: number
  name: {
    vi: string
    en: string
  }
  note?: string
  priority: number
  protocol_code: number
  question?: IQuestion[]
}

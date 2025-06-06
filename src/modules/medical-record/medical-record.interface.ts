import { RecordLevel } from 'src/constants/record-level.enum'
import { IQuestion } from '../classify-question/classify-question.interface'

export interface IMedicalRecord {
  id: number
  code: string
  doctor: IDoctorInfo
  patient: Ipatient
  medical_advice: boolean
  records?: IRecord
  // level_system: RecordLevel | null
}

export interface IRecord {
  protocol_code: number
  protocol_name?: {
    vi: string
    en: string
  }
  note: string
  protocol_before?: number
  // question_answer?: IResultQandA[]
  question_answer?: IQuestion[]
  level_system: number | null // Hệ thống đánh giá
  level_doctor: number | null // doctor đánh giá
}

export interface IResultQandA {
  id: number
  answer: string
}

export interface IDoctorInfo {
  name: string
  email?: string
  birth?: string
  gender?: 'Male' | 'Female'
  role: 'Admin' | 'Doctor' | 'Patient'
}

export interface Ipatient {
  name: string
  email?: string
  birth?: string
  gender?: 'Male' | 'Female'
}

export interface IProtocolChange {
  protocol_code: number
  name: {
    en: string
    vi: string
  }
}

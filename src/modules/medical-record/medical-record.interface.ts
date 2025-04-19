export interface IMedicalRecord {
  id: number
  doctor: IDoctorInfo
  records: IRecord[]
  level_system: 'Green' | 'Yellow' | 'Red' | 'Purple' | 'Orange' | 'Blue' // Hệ thống đánh giá
  level_doctor: 'Green' | 'Yellow' | 'Red' | 'Purple' | 'Orange' | 'Blue' | null // doctor đánh giá
}

export interface IRecord {
  protocol_code: number
  note: string
  question_answer?: IResultQandA[]
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

export interface IProtocolChange {
  protocol_code: number
  id: number
}

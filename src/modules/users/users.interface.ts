export interface IUser {
  id: number
  name?: string
  email?: string
  birth?: string
  gender?: 'Male' | 'Female'
  role?: 'Admin' | 'Doctor' | 'Patient'
}

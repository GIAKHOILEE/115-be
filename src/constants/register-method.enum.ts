export enum RegisterMethod {
  REGISTER = 'REGISTER',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
}

export type RegisterType = keyof typeof RegisterMethod

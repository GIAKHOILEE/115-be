import * as bcrypt from 'bcryptjs'
import * as fs from 'fs'
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function validateHash(password: string | undefined, hash: string | undefined): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false)
  }

  return bcrypt.compare(password, hash)
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

export function getPermissions() {
  const data = fs.readFileSync('src/common/permissions.json', 'utf-8')
  return JSON.parse(data)
}

export function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export function formatArrayToObject(arr: any[], key: string = 'id') {
  const result: any = {}
  arr?.forEach((item: any) => {
    result[item[key]] = {
      ...item,
    }
  })

  return result
}

import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { jwtConfig } from 'src/config/jwt.config'

export interface ExtendedRequest extends Request {
  auth?: any
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: ExtendedRequest, res: Response, next: NextFunction) {
    const token = req.cookies?.access_token || req.headers.authorization?.split(' ')[1]
    if (token) {
      try {
        const decoded = jwt.verify(token, jwtConfig.secret)
        req.auth = decoded
      } catch (error) {
        console.error('Invalid token:', error.message)
      }
    }

    next()
  }
}

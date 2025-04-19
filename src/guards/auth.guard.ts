import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /*=====================================
  ========== AUTH HEADER BEARER =========
  ======================================*/
  // canActivate(context: ExecutionContext): boolean {
  //   const request = context.switchToHttp().getRequest<Request>()
  //   const authHeader = request.headers.authorization

  //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //     throw new UnauthorizedException('MISSING_OR_INVALID_TOKEN')
  //   }

  //   const token = authHeader.split(' ')[1]

  //   try {
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET) as any
  //     const formattedDecoded = {
  //       ...decoded,
  //       role: {
  //         id: decoded.role.id,
  //         name: decoded.role.name,
  //         permissions: arrayToObjectPermissions(decoded.role.permissions),
  //       },
  //     }
  //     request.user = formattedDecoded
  //     return true
  //   } catch (error) {
  //     throw new UnauthorizedException('INVALID_OR_EXPIRED_TOKEN')
  //   }
  // }

  /*=====================================
  ============ AUTH COOKIE =============
  ======================================*/
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()

    const token = request.cookies?.access_token

    if (!token) {
      throw new UnauthorizedException('MISSING_OR_INVALID_TOKEN')
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any

      request.user = {
        ...decoded,
        role: {
          id: decoded.role.id,
          name: decoded.role.name,
          permissions: decoded.role.permissions,
        },
      }

      return true
    } catch (error) {
      throw new UnauthorizedException('INVALID_OR_EXPIRED_TOKEN')
    }
  }
}

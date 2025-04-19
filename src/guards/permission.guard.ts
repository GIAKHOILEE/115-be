import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /*=====================================
  ========== AUTH HEADER BEARER =========
  ======================================*/
  // canActivate(context: ExecutionContext): boolean {
  //   const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler())
  //   if (!requiredPermissions) return true // Nếu không có quyền yêu cầu, cho phép truy cập

  //   const request = context.switchToHttp().getRequest()
  //   const authHeader = request.headers.authorization

  //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //     throw new UnauthorizedException('MISSING_OR_INVALID_TOKEN')
  //   }

  //   const token = authHeader.split(' ')[1]
  //   let decoded: any
  //   try {
  //     decoded = jwt.verify(token, process.env.JWT_SECRET) as any
  //   } catch (error) {
  //     throw new UnauthorizedException('INVALID_OR_EXPIRED_TOKEN')
  //   }

  //   if (!decoded || !decoded?.role?.permissions) {
  //     throw new ForbiddenException('USER_DOES_NOT_HAVE_PERMISSIONS')
  //   }

  //   const permissions = decoded.role.permissions
  //   // Kiểm tra xem user có tất cả quyền yêu cầu không
  //   const hasPermission = requiredPermissions.every(permission => permissions.includes(permission))

  //   if (!hasPermission) {
  //     throw new ForbiddenException('YOU_DO_NOT_HAVE_PERMISSION_TO_ACCESS_THIS_RESOURCE')
  //   }

  //   return true
  // }

  /*=====================================
  ============ AUTH COOKIE =============
  ======================================*/
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler())
    if (!requiredPermissions) return true // Nếu không có quyền yêu cầu, cho phép truy cập

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

      // Kiểm tra quyền
      const user = request.user as any
      const permissions = user.role.permissions
      const hasPermission = requiredPermissions.every(permission => permissions.includes(permission))

      if (!hasPermission) {
        throw new ForbiddenException('YOU_DO_NOT_HAVE_PERMISSION_TO_ACCESS_THIS_RESOURCE')
      }

      return true
    } catch (error) {
      throw new UnauthorizedException('INVALID_OR_EXPIRED_TOKEN')
    }
  }
}

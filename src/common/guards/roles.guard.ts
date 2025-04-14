import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../modules/user/entities/user.entity';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    sub: number;
    username: string;
    role: UserRole;
    iat: number;
    exp: number;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // console.log('RolesGuard');
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }
    // console.log(requiredRoles);
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return requiredRoles.some((role) => request.user.role === role);
  }
}

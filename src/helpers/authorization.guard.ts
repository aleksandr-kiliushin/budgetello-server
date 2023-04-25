import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import * as jwt from "jsonwebtoken"

import { UsersService } from "#models/users/service"

import { GqlError } from "#helpers/GqlError"

import { GqlErrorCode } from "#constants"

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(executionContext: ExecutionContext) {
    const gqlExecutionContext = GqlExecutionContext.create(executionContext).getContext()

    const authorizationToken = gqlExecutionContext.req.headers.authorization
    if (authorizationToken === undefined) return false

    const jwtSecret = process.env.JWT_SECRET
    if (jwtSecret === undefined) {
      throw new GqlError(GqlErrorCode.INTERNAL_SERVER_ERROR, { message: "Server has no JWT secret." })
    }

    try {
      jwt.verify(authorizationToken, jwtSecret)
      const decodingResult = jwt.decode(authorizationToken, { json: true })
      if (decodingResult === null) throw new Error()
      gqlExecutionContext.authorizedUser = await this.usersService.find({ userId: decodingResult.id })
    } catch {
      throw new GqlError(GqlErrorCode.UNAUTHORIZED, { message: "Invalid token." })
    }

    return true
  }
}

// TODO: Move to src/helpers/guards.
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import * as jwt from "jsonwebtoken"

import { UsersService } from "#models/users/service"

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(executionContext: ExecutionContext) {
    const gqlExecutionContext = GqlExecutionContext.create(executionContext).getContext()

    const authToken = gqlExecutionContext.req.headers.authorization
    if (authToken === undefined) return false

    const jwtSecret = process.env.JWT_SECRET
    if (jwtSecret === undefined) {
      throw new ServiceUnavailableException({ message: "Server has no JWT secret." })
    }

    try {
      jwt.verify(authToken, jwtSecret)
      const decodingResult = jwt.decode(authToken, { json: true })
      if (decodingResult === null) throw new Error()
      gqlExecutionContext.authorizedUser = await this.usersService.find({
        userId: decodingResult.id,
        relations: { administratedBoards: true, boards: true },
      })
    } catch {
      throw new UnauthorizedException("Invalid token.")
    }

    return true
  }
}

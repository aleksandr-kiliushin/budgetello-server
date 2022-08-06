import { Injectable, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common"
import { CanActivate, ExecutionContext } from "@nestjs/common"
import * as jwt from "jsonwebtoken"

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const authToken = request.headers.authorization

    const jwtSecret = process.env.JWT_SECRET
    if (jwtSecret === undefined) {
      throw new ServiceUnavailableException({ message: "Server has no JWT secret." })
    }

    try {
      jwt.verify(authToken, jwtSecret)
      const decodingResult = jwt.decode(authToken, { json: true })
      if (decodingResult === null) throw new Error()
      const { id } = decodingResult
      request.userId = id
    } catch (err) {
      throw new UnauthorizedException("Invalid token.")
    }

    return true
  }
}

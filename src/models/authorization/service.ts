import { Injectable } from "@nestjs/common"
import * as jwt from "jsonwebtoken"

import { UsersService } from "#models/users/service"

import { GqlError } from "#helpers/GqlError"
import { encrypt } from "#helpers/crypto"

import { GqlErrorCode } from "#constants"

import { CreateAuthorizationTokenInput } from "./dto/create-authorization-token.input"

@Injectable()
export class AuthorizationService {
  constructor(private readonly usersService: UsersService) {}

  async createToken({ input }: { input: CreateAuthorizationTokenInput }): Promise<string> {
    const user = await this.usersService.find({ userUsername: input.username }).catch(() => {
      throw new GqlError(GqlErrorCode.BAD_REQUEST, { fields: { username: "User not found." } })
    })

    const hashedPassword = encrypt(input.password)
    const isPasswordValid = hashedPassword === user.password

    if (!isPasswordValid) throw new GqlError(GqlErrorCode.BAD_REQUEST, { fields: { password: "Invalid password." } })

    const jwtSecret = process.env.JWT_SECRET
    if (jwtSecret === undefined) {
      throw new GqlError(GqlErrorCode.INTERNAL_SERVER_ERROR, { message: "Server has no JWT secret." })
    }

    const authorizationToken = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: "10d" })
    return authorizationToken
  }
}

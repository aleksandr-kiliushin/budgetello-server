import { BadRequestException, Injectable, ServiceUnavailableException } from "@nestjs/common"
import * as jwt from "jsonwebtoken"

import { UsersService } from "#models/users/service"

import { encrypt } from "#utils/crypto"

import { AuthorizeDto } from "./dto/authorize.dto"

@Injectable()
export class AuthorizationService {
  constructor(private readonly usersService: UsersService) {}

  async createToken({ input }: { input: AuthorizeDto }): Promise<string> {
    const user = await this.usersService.find({ userUsername: input.username }).catch(() => {
      throw new BadRequestException({ fields: { username: "User not found." } })
    })

    const hashedPassword = encrypt(input.password)
    const isPasswordValid = hashedPassword === user.password

    if (!isPasswordValid) throw new BadRequestException({ fields: { password: "Invalid password." } })

    const jwtSecret = process.env.JWT_SECRET
    if (jwtSecret === undefined) {
      throw new ServiceUnavailableException({ message: "Server has no JWT secret." })
    }

    const authorizationToken = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: "10d" })
    return authorizationToken
  }
}

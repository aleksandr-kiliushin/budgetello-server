import { BadRequestException, Injectable, ServiceUnavailableException } from "@nestjs/common"
import * as jwt from "jsonwebtoken"

import { UsersService } from "#models/users/service"

import { encrypt } from "#utils/crypto"

import { AuthorizeDto } from "./dto/authorize.dto"

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async createToken({ requestBody }: { requestBody: AuthorizeDto }): Promise<{ authToken: string }> {
    const user = await this.usersService.find({ userUsername: requestBody.username }).catch(() => {
      throw new BadRequestException({ fields: { username: "User not found." } })
    })

    const hashedPassword = encrypt(requestBody.password)
    const isPasswordValid = hashedPassword === user.password

    if (!isPasswordValid) throw new BadRequestException({ fields: { password: "Invalid password." } })

    const jwtSecret = process.env.JWT_SECRET
    if (jwtSecret === undefined) {
      throw new ServiceUnavailableException({ message: "Server has no JWT secret." })
    }

    return {
      authToken: jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: "10d" }),
    }
  }
}

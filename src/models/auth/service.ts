import { BadRequestException, Injectable, ServiceUnavailableException } from "@nestjs/common"
import * as jwt from "jsonwebtoken"

import { UserService } from "#models/user/service"

import { encrypt } from "#utils/crypto"

import { LoginDto } from "./dto/login.dto"

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async createToken(loginDto: LoginDto): Promise<{ authToken: string }> {
    const user = await this.userService.find({ userUsername: loginDto.username }).catch(() => {
      throw new BadRequestException({ fields: { username: "User not found." } })
    })

    const hashedPassword = encrypt(loginDto.password)
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

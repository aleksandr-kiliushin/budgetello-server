import { Injectable, NotFoundException, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common"
import * as jwt from "jsonwebtoken"

import { UserService } from "#models/user/service"

import { encrypt } from "#utils/crypto"

import { LoginDto } from "./dto/login.dto"

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async createToken(loginDto: LoginDto): Promise<{ authToken: string }> {
    const { password, username } = loginDto

    const user = await this.userService.findUser({ username })

    if (user === null) throw new NotFoundException({})

    const hashedPassword = encrypt(password)
    const isPasswordValid = hashedPassword === user.password

    if (!isPasswordValid) throw new UnauthorizedException({ message: "Invalid password." })

    const jwtSecret = process.env.JWT_SECRET
    if (jwtSecret === undefined) {
      throw new ServiceUnavailableException({ message: "Server has no JWT secret." })
    }

    return {
      authToken: jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: "10d" }),
    }
  }
}

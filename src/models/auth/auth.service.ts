import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcrypt"

import { UserService } from "#models/user/user.service"
import { LoginDto } from "./dto/login.dto"

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async createToken(loginDto: LoginDto): Promise<{ authToken: string }> {
    const { password, username } = loginDto

    const user = await this.userService.findUser({ userIdentifier: username })

    if (user === null) throw new NotFoundException({})

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) throw new UnauthorizedException({ message: "Invalid password." })

    return {
      authToken: jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: "10d",
      }),
    }
  }
}

import { Body, Controller, Post } from "@nestjs/common"

import { LoginDto } from "./dto/login.dto"
import { AuthService } from "./service"

@Controller("login")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(
    @Body()
    loginDto: LoginDto
  ) {
    return this.authService.createToken(loginDto)
  }
}

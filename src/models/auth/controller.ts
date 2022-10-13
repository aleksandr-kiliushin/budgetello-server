import { Body, Controller, Post } from "@nestjs/common"

import { JoiValidationPipe } from "#helpers/JoiValidationSchema"

import { LoginDto } from "./dto/login.dto"
import { AuthService } from "./service"
import { authorizeValidator } from "./validators/authorize.validator"

@Controller("login")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(
    @Body(new JoiValidationPipe(authorizeValidator))
    loginDto: LoginDto
  ) {
    return this.authService.createToken(loginDto)
  }
}

import { Body, Controller, Post } from "@nestjs/common"

import { ValidationPipe } from "#helpers/validator.pipe"

import { AuthorizeDto } from "./dto/authorize.dto"
import { AuthService } from "./service"

@Controller("authorize")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async authorize(
    @Body(new ValidationPipe())
    requestBody: AuthorizeDto
  ) {
    return this.authService.createToken({ requestBody })
  }
}

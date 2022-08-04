import { Module } from "@nestjs/common"

import { UserModule } from "#models/user/user.module"

import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"

@Module({
  imports: [UserModule],
  providers: [AuthController, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from "@nestjs/common"

import { UserModule } from "#models/user/module"

import { AuthController } from "./controller"
import { AuthService } from "./service"

@Module({
  controllers: [AuthController],
  imports: [UserModule],
  providers: [AuthController, AuthService],
})
export class AuthModule {}

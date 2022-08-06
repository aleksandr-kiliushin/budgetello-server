import { Module } from "@nestjs/common"

import { UserModule } from "#models/user/module"

import { AuthController } from "./controller"
import { AuthService } from "./service"

@Module({
  imports: [UserModule],
  providers: [AuthController, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from "@nestjs/common"

import { UsersModule } from "#models/users/module"

import { AuthController } from "./controller"
import { AuthService } from "./service"

@Module({
  controllers: [AuthController],
  imports: [UsersModule],
  providers: [AuthController, AuthService],
})
export class AuthModule {}

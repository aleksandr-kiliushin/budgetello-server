import { Module } from "@nestjs/common"

import { UsersModule } from "#models/users/module"

import { AuthorizationResolver } from "./resolver"
import { AuthorizationService } from "./service"

@Module({
  imports: [UsersModule],
  providers: [AuthorizationResolver, AuthorizationService],
})
export class AuthorizationModule {}

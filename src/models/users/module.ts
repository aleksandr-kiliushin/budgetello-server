import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UserEntity } from "./entities/user.entity"
import { UsersResolver } from "./resolver"
import { UsersService } from "./service"

@Module({
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}

import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UserEntity } from "./entities/user.entity"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Module({
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserController, UserService],
  controllers: [UserController],
})
export class UserModule {}

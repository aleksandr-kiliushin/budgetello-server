import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersController } from "./controller"
import { UserEntity } from "./entities/user.entity"
import { UsersService } from "./service"

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersController, UsersService],
})
export class UsersModule {}

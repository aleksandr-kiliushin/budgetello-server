import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "#models/users/module"

import { BoardSubjectsController } from "./controller"
import { BoardSubjectEntity } from "./entities/board-subject.entity"
import { BoardSubjectsService } from "./service"

@Module({
  controllers: [BoardSubjectsController],
  exports: [BoardSubjectsService],
  imports: [TypeOrmModule.forFeature([BoardSubjectEntity]), UsersModule],
  providers: [BoardSubjectsController, BoardSubjectsService],
})
export class BoardSubjectsModule {}

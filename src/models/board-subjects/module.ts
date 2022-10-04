import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UserModule } from "#models/user/module"

import { BoardSubjectsController } from "./controller"
import { BoardSubjectEntity } from "./entities/board-subject.entity"
import { BoardSubjectsService } from "./service"

@Module({
  controllers: [BoardSubjectsController],
  exports: [BoardSubjectsService],
  imports: [TypeOrmModule.forFeature([BoardSubjectEntity]), UserModule],
  providers: [BoardSubjectsController, BoardSubjectsService],
})
export class BoardSubjectsModule {}

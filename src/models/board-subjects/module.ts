import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { BoardSubjectsController } from "./controller"
import { BoardSubjectEntity } from "./entities/board-subject.entity"
import { BoardSubjectsService } from "./service"

@Module({
  exports: [BoardSubjectsService],
  imports: [TypeOrmModule.forFeature([BoardSubjectEntity])],
  providers: [BoardSubjectsController, BoardSubjectsService],
  controllers: [BoardSubjectsController],
})
export class BoardSubjectsModule {}

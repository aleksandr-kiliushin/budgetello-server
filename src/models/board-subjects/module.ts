import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "#models/users/module"

import { BoardSubjectEntity } from "./entities/board-subject.entity"
import { BoardSubjectsResolver } from "./resolver"
import { BoardSubjectsService } from "./service"

@Module({
  exports: [BoardSubjectsService],
  imports: [TypeOrmModule.forFeature([BoardSubjectEntity]), UsersModule],
  providers: [BoardSubjectsResolver, BoardSubjectsService],
})
export class BoardSubjectsModule {}

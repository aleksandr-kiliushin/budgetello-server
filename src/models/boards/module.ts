import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { BoardSubjectsModule } from "#models/board-subjects/module"
import { UsersModule } from "#models/users/module"

import { BoardEntity } from "./entities/board.entity"
import { BoardsResolver } from "./resolver"
import { BoardsService } from "./service"

@Module({
  exports: [BoardsService],
  imports: [TypeOrmModule.forFeature([BoardEntity]), BoardSubjectsModule, UsersModule],
  providers: [BoardsResolver, BoardsService],
})
export class BoardsModule {}

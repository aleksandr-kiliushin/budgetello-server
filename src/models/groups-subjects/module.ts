import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { GroupsSubjectsController } from "./controller"
import { GroupsSubjectsEntity } from "./entities/groups-subjects.entity"
import { GroupsSubjectsService } from "./service"

@Module({
  exports: [GroupsSubjectsService],
  imports: [TypeOrmModule.forFeature([GroupsSubjectsEntity])],
  providers: [GroupsSubjectsController, GroupsSubjectsService],
  controllers: [GroupsSubjectsController],
})
export class GroupsSubjectsModule {}

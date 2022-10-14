import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { ActivityCategoriesModule } from "#models/activity-categories/module"
import { UsersModule } from "#models/users/module"

import { ActivityRecordsController } from "./controller"
import { ActivityRecordEntity } from "./entities/activity-record.entity"
import { ActivityRecordsService } from "./service"

@Module({
  controllers: [ActivityRecordsController],
  imports: [TypeOrmModule.forFeature([ActivityRecordEntity]), ActivityCategoriesModule, UsersModule],
  providers: [ActivityRecordsController, ActivityRecordsService],
})
export class ActivityRecordsModule {}

import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { ActivityCategoriesModule } from "#models/activity-categories/module"
import { UsersModule } from "#models/users/module"

import { ActivityRecordEntity } from "./entities/activity-record.entity"
import { ActivityRecordsResolver } from "./resolver"
import { ActivityRecordsService } from "./service"

@Module({
  imports: [TypeOrmModule.forFeature([ActivityRecordEntity]), ActivityCategoriesModule, UsersModule],
  providers: [ActivityRecordsResolver, ActivityRecordsService],
})
export class ActivityRecordsModule {}

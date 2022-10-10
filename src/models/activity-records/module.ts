import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { ActivityCategoriesModule } from "#models/activity-categories/module"
import { UserModule } from "#models/user/module"

import { ActivityRecordsController } from "./controller"
import { ActivityRecordEntity } from "./entities/activity-record.entity"
import { ActivityRecordsService } from "./service"

@Module({
  controllers: [ActivityRecordsController],
  imports: [TypeOrmModule.forFeature([ActivityRecordEntity]), ActivityCategoriesModule, UserModule],
  providers: [ActivityRecordsController, ActivityRecordsService],
})
export class ActivityRecordsModule {}

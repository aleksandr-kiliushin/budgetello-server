import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { ActivityCategoryMeasurementTypesModule } from "#models/activity-category-measurement-types/module"
import { BoardsModule } from "#models/boards/module"
import { UserModule } from "#models/user/module"

import { ActivityCategoriesController } from "./controller"
import { ActivityCategoryEntity } from "./entities/activity-category.entity"
import { ActivityCategoriesService } from "./service"

@Module({
  controllers: [ActivityCategoriesController],
  exports: [ActivityCategoriesService],
  imports: [
    TypeOrmModule.forFeature([ActivityCategoryEntity]),
    ActivityCategoryMeasurementTypesModule,
    BoardsModule,
    UserModule,
  ],
  providers: [ActivityCategoriesController, ActivityCategoriesService],
})
export class ActivityCategoriesModule {}

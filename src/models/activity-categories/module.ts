import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { ActivityCategoryMeasurementTypesModule } from "#models/activity-category-measurement-types/module"
import { BoardsModule } from "#models/boards/module"
import { UsersModule } from "#models/users/module"

import { ActivityCategoryEntity } from "./entities/activity-category.entity"
import { ActivityCategoriesResolver } from "./resolver"
import { ActivityCategoriesService } from "./service"

@Module({
  exports: [ActivityCategoriesService],
  imports: [
    TypeOrmModule.forFeature([ActivityCategoryEntity]),
    ActivityCategoryMeasurementTypesModule,
    BoardsModule,
    UsersModule,
  ],
  providers: [ActivityCategoriesResolver, ActivityCategoriesService],
})
export class ActivityCategoriesModule {}

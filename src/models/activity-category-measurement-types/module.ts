import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "#models/users/module"

import { ActivityCategoryMeasurementTypesController } from "./controller"
import { ActivityCategoryMeasurementTypeEntity } from "./entities/activity-category-measurement-type.entity"
import { ActivityCategoryMeasurementTypesService } from "./service"

@Module({
  controllers: [ActivityCategoryMeasurementTypesController],
  exports: [ActivityCategoryMeasurementTypesService],
  imports: [TypeOrmModule.forFeature([ActivityCategoryMeasurementTypeEntity]), UsersModule],
  providers: [ActivityCategoryMeasurementTypesController, ActivityCategoryMeasurementTypesService],
})
export class ActivityCategoryMeasurementTypesModule {}

import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UserModule } from "#models/user/module"

import { ActivityCategoryMeasurementTypesController } from "./controller"
import { ActivityCategoryMeasurementTypeEntity } from "./entities/activity-category-measurement-type.entity"
import { ActivityCategoryMeasurementTypesService } from "./service"

@Module({
  controllers: [ActivityCategoryMeasurementTypesController],
  exports: [ActivityCategoryMeasurementTypesService],
  imports: [TypeOrmModule.forFeature([ActivityCategoryMeasurementTypeEntity]), UserModule],
  providers: [ActivityCategoryMeasurementTypesController, ActivityCategoryMeasurementTypesService],
})
export class ActivityCategoryMeasurementTypesModule {}

import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "#models/users/module"

import { ActivityCategoryMeasurementTypeEntity } from "./entities/activity-category-measurement-type.entity"
import { ActivityCategoryMeasurementTypesResolver } from "./resolver"
import { ActivityCategoryMeasurementTypesService } from "./service"

@Module({
  exports: [ActivityCategoryMeasurementTypesService],
  imports: [TypeOrmModule.forFeature([ActivityCategoryMeasurementTypeEntity]), UsersModule],
  providers: [ActivityCategoryMeasurementTypesResolver, ActivityCategoryMeasurementTypesService],
})
export class ActivityCategoryMeasurementTypesModule {}

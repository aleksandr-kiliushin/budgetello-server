import { UseGuards } from "@nestjs/common"
import { Args, Int, Query, Resolver } from "@nestjs/graphql"

import { AuthGuard } from "#models/auth/guard"

import { ActivityCategoryMeasurementTypeEntity } from "./entities/activity-category-measurement-type.entity"
import { ActivityCategoryMeasurementType } from "./models/activity-category-measurement-type.model"
import { ActivityCategoryMeasurementTypesService } from "./service"

@Resolver(() => ActivityCategoryMeasurementType)
@UseGuards(AuthGuard)
export class ActivityCategoryMeasurementTypesResolver {
  constructor(private readonly activityCategoryMeasurementTypeService: ActivityCategoryMeasurementTypesService) {}

  @Query(() => [ActivityCategoryMeasurementType], { name: "activityCategoryMeasurementTypes" })
  getAll(): Promise<ActivityCategoryMeasurementTypeEntity[]> {
    return this.activityCategoryMeasurementTypeService.getAll()
  }

  @Query(() => ActivityCategoryMeasurementType, { name: "activityCategoryMeasurementType" })
  find(
    @Args("id", { type: () => Int })
    typeId: number
  ): Promise<ActivityCategoryMeasurementTypeEntity> {
    return this.activityCategoryMeasurementTypeService.find({ typeId })
  }
}

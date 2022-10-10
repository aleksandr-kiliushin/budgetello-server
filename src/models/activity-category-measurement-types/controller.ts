import { Controller, Get, Param, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { ActivityCategoryMeasurementTypesService } from "./service"

@Controller("activities/category-measurement-types")
@UseGuards(AuthGuard)
export class ActivityCategoryMeasurementTypesController {
  constructor(private readonly activityCategoryMeasurementTypeService: ActivityCategoryMeasurementTypesService) {}

  @Get()
  getAll() {
    return this.activityCategoryMeasurementTypeService.getAll()
  }

  @Get(":id")
  find(
    @Param("id")
    measurementTypeId: string
  ) {
    return this.activityCategoryMeasurementTypeService.find({
      measurementTypeId: parseInt(measurementTypeId),
    })
  }
}

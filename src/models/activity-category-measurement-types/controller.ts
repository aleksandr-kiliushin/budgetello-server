import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common"

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

  @Get(":typeId")
  find(
    @Param("typeId", ParseIntPipe)
    typeId: number
  ) {
    return this.activityCategoryMeasurementTypeService.find({ typeId })
  }
}

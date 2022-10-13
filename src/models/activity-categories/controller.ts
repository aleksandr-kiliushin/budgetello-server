import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/user/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"
import { JoiValidationPipe } from "#helpers/JoiValidationSchema"

import { CreateActivityCategoryDto } from "./dto/create-activity-category.dto"
import { SearchActivityCategoriesQueryDto } from "./dto/seach-activity-categories-query.dto"
import { UpdateActivityCategoryDto } from "./dto/update-activity-category.dto"
import { ActivityCategoriesService } from "./service"
import { createCategoryValidator } from "./validators/create-category.validator"

@Controller("activities/categories")
@UseGuards(AuthGuard)
export class ActivityCategoriesController {
  constructor(private activityCategoriesService: ActivityCategoriesService) {}

  @Get("search")
  search(
    @Query()
    query: SearchActivityCategoriesQueryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityCategoriesService.search({ authorizedUser, query })
  }

  @Get(":categoryId")
  find(
    @Param("categoryId", ParseIntPipe)
    categoryId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityCategoriesService.find({ authorizedUser, categoryId })
  }

  @Post()
  create(
    @Body(new JoiValidationPipe(createCategoryValidator))
    requestBody: CreateActivityCategoryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityCategoriesService.create({ authorizedUser, requestBody })
  }

  @Patch(":categoryId")
  update(
    @Param("categoryId", ParseIntPipe)
    categoryId: number,
    @Body()
    requestBody: UpdateActivityCategoryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityCategoriesService.update({ authorizedUser, categoryId, requestBody })
  }

  @Delete(":categoryId")
  delete(
    @Param("categoryId", ParseIntPipe)
    categoryId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityCategoriesService.delete({ authorizedUser, categoryId })
  }
}

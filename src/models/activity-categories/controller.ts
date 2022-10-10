import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/user/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { CreateActivityCategoryDto } from "./dto/create-activity-category.dto"
import { SearchActivityCategoriesQueryDto } from "./dto/seach-activity-categories-query.dto"
import { UpdateActivityCategoryDto } from "./dto/update-activity-category.dto"
import { ActivityCategoriesService } from "./service"

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

  @Get(":id")
  find(
    @Param("id")
    categoryId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityCategoriesService.find({ authorizedUser, categoryId: parseInt(categoryId) })
  }

  @Post()
  create(
    @Body()
    requestBody: CreateActivityCategoryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityCategoriesService.create({ authorizedUser, requestBody })
  }

  @Patch(":id")
  update(
    @Param("id")
    categoryId: string,
    @Body()
    requestBody: UpdateActivityCategoryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityCategoriesService.update({
      authorizedUser,
      categoryId: parseInt(categoryId),
      requestBody,
    })
  }

  @Delete(":id")
  delete(
    @Param("id")
    categoryId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityCategoriesService.delete({ authorizedUser, categoryId: parseInt(categoryId) })
  }
}

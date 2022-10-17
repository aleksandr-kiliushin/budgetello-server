import { UseGuards } from "@nestjs/common"
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"

import { AuthorizationGuard } from "#models/authorization/guard"
import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { CreateActivityCategoryInput } from "./dto/create-activity-category.input"
import { SearchActivityCategoriesArgs } from "./dto/search-activity-categories.args"
import { ActivityCategoryEntity } from "./entities/activity-category.entity"
import { ActivityCategory } from "./models/activity-category.model"
import { ActivityCategoriesService } from "./service"

@Resolver(() => ActivityCategory)
@UseGuards(AuthorizationGuard)
export class ActivityCategoriesResolver {
  constructor(private activityCategoriesService: ActivityCategoriesService) {}

  @Query((returns) => [ActivityCategory], { name: "activityCategories" })
  search(
    @Args()
    args: SearchActivityCategoriesArgs,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<ActivityCategoryEntity[]> {
    return this.activityCategoriesService.search({ args, authorizedUser })
  }

  @Query((returns) => ActivityCategory, { name: "activityCategory" })
  find(
    @Args("id", { type: () => Int })
    categoryId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<ActivityCategoryEntity> {
    return this.activityCategoriesService.find({ authorizedUser, categoryId })
  }

  @Mutation((returns) => ActivityCategory, { name: "createActivityCategory" })
  create(
    @Args("input")
    input: CreateActivityCategoryInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<ActivityCategoryEntity> {
    return this.activityCategoriesService.create({ authorizedUser, input })
  }

  // @Post()
  // create(
  //   @Body(new ValidationPipe())
  //   requestBody: CreateActivityCategoryDto,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.activityCategoriesService.create({ authorizedUser, requestBody })
  // }

  // @Patch(":categoryId")
  // update(
  //   @Param("categoryId", ParseIntPipe)
  //   categoryId: number,
  //   @Body()
  //   requestBody: UpdateActivityCategoryDto,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.activityCategoriesService.update({ authorizedUser, categoryId, requestBody })
  // }

  // @Delete(":categoryId")
  // delete(
  //   @Param("categoryId", ParseIntPipe)
  //   categoryId: number,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.activityCategoriesService.delete({ authorizedUser, categoryId })
  // }
}

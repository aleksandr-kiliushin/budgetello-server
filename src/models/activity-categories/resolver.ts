import { UseGuards } from "@nestjs/common"
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"

import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizationGuard } from "#helpers/authorization.guard"
import { AuthorizedUser } from "#helpers/authorized-user.decorator"
import { ValidationPipe } from "#helpers/validation.pipe"

import { CreateActivityCategoryInput } from "./dto/create-activity-category.input"
import { SearchActivityCategoriesArgs } from "./dto/search-activity-categories.args"
import { UpdateActivityCategoryInput } from "./dto/update-activity-category.input"
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
    @Args("input", ValidationPipe)
    input: CreateActivityCategoryInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<ActivityCategoryEntity> {
    return this.activityCategoriesService.create({ authorizedUser, input })
  }

  @Mutation((returns) => ActivityCategory, { name: "updateActivityCategory" })
  update(
    @Args("input", ValidationPipe)
    input: UpdateActivityCategoryInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<ActivityCategoryEntity> {
    return this.activityCategoriesService.update({ authorizedUser, input })
  }

  @Mutation((returns) => ActivityCategory, { name: "deleteActivityCategory" })
  delete(
    @Args("id", { type: () => Int })
    categoryId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<ActivityCategoryEntity> {
    return this.activityCategoriesService.delete({ authorizedUser, categoryId })
  }
}

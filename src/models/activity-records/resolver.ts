import { UseGuards } from "@nestjs/common"
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"

import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizationGuard } from "#helpers/authorization.guard"
import { AuthorizedUser } from "#helpers/authorized-user.decorator"
import { ValidationPipe } from "#helpers/validation.pipe"

import { CreateActivityRecordInput } from "./dto/create-activity-record.input"
import { SearchActivityRecordsArgs } from "./dto/search-budget-records.args"
import { UpdateActivityRecordInput } from "./dto/update-activity-record.input"
import { ActivityRecordEntity } from "./entities/activity-record.entity"
import { ActivityRecord } from "./models/activity-record.model"
import { ActivityRecordsService } from "./service"

@Resolver(() => ActivityRecord)
@UseGuards(AuthorizationGuard)
export class ActivityRecordsResolver {
  constructor(private readonly activityRecordsService: ActivityRecordsService) {}

  @Query((returns) => [ActivityRecord], { name: "activityRecords" })
  search(
    @Args(ValidationPipe)
    args: SearchActivityRecordsArgs,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<ActivityRecordEntity[]> {
    return this.activityRecordsService.search({ args, authorizedUser })
  }

  @Query((returns) => ActivityRecord, { name: "activityRecord" })
  find(
    @Args("id", { type: () => Int })
    recordId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<ActivityRecordEntity> {
    return this.activityRecordsService.find({ authorizedUser, recordId })
  }

  @Mutation((returns) => ActivityRecord, { name: "createActivityRecord" })
  create(
    @Args("input", ValidationPipe)
    input: CreateActivityRecordInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<ActivityRecordEntity> {
    return this.activityRecordsService.create({ authorizedUser, input })
  }

  @Mutation((returns) => ActivityRecord, { name: "updateActivityRecord" })
  update(
    @Args("input", ValidationPipe)
    input: UpdateActivityRecordInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<ActivityRecordEntity> {
    return this.activityRecordsService.update({ authorizedUser, input })
  }

  @Mutation((returns) => ActivityRecord, { name: "deleteActivityRecord" })
  delete(
    @Args("id", { type: () => Int })
    recordId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<ActivityRecordEntity> {
    return this.activityRecordsService.delete({ authorizedUser, recordId })
  }
}

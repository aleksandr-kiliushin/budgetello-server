import { UseGuards } from "@nestjs/common"
import { Args, Int, Query, Resolver } from "@nestjs/graphql"

import { AuthorizationGuard } from "#models/authorization/guard"
import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { SearchActivityRecordsArgs } from "./dto/search-budget-records.args"
import { ActivityRecordEntity } from "./entities/activity-record.entity"
import { ActivityRecord } from "./models/activity-record.model"
import { ActivityRecordsService } from "./service"

@Resolver(() => ActivityRecord)
@UseGuards(AuthorizationGuard)
export class ActivityRecordsResolver {
  constructor(private readonly activityRecordsService: ActivityRecordsService) {}

  @Query((returns) => [ActivityRecord], { name: "activityRecords" })
  search(
    @Args()
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

  // @Post()
  // create(
  //   @Body(new ValidationPipe())
  //   requestBody: CreateActivityRecordDto,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.activityRecordsService.create({ authorizedUser, requestBody })
  // }

  // @Patch(":recordId")
  // update(
  //   @Param("recordId", ParseIntPipe)
  //   recordId: number,
  //   @Body()
  //   requestBody: UpdateActivityRecordDto,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.activityRecordsService.update({ authorizedUser, requestBody, recordId })
  // }

  // @Delete(":recordId")
  // delete(
  //   @Param("recordId", ParseIntPipe)
  //   recordId: number,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.activityRecordsService.delete({ authorizedUser, recordId })
  // }
}

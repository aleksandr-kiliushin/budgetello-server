import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/user/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { CreateActivityRecordDto } from "./dto/create-activity-record.dto"
import { SearchActivityRecordsQueryDto } from "./dto/search-activity-records-query.dto"
import { UpdateActivityRecordDto } from "./dto/update-activity-record.dto"
import { ActivityRecordsService } from "./service"

@Controller("activities/records")
@UseGuards(AuthGuard)
export class ActivityRecordsController {
  constructor(private readonly activityRecordsService: ActivityRecordsService) {}

  @Get("search")
  search(
    @Query()
    query: SearchActivityRecordsQueryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityRecordsService.search({ authorizedUser, query })
  }

  @Get(":id")
  find(
    @Param("id")
    recordId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityRecordsService.find({ authorizedUser, recordId: parseInt(recordId) })
  }

  @Post()
  create(
    @Body()
    requestBody: CreateActivityRecordDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityRecordsService.create({ authorizedUser, requestBody })
  }

  @Patch(":id")
  update(
    @Param("id")
    recordId: string,
    @Body()
    requestBody: UpdateActivityRecordDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityRecordsService.update({ authorizedUser, requestBody, recordId: parseInt(recordId) })
  }

  @Delete(":id")
  delete(
    @Param("id")
    recordId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityRecordsService.delete({ authorizedUser, recordId: parseInt(recordId) })
  }
}

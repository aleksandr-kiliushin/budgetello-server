import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"
import { ValidationPipe } from "#helpers/validator.pipe"

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

  @Get(":recordId")
  find(
    @Param("recordId", ParseIntPipe)
    recordId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityRecordsService.find({ authorizedUser, recordId })
  }

  @Post()
  create(
    @Body(new ValidationPipe())
    requestBody: CreateActivityRecordDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityRecordsService.create({ authorizedUser, requestBody })
  }

  @Patch(":recordId")
  update(
    @Param("recordId", ParseIntPipe)
    recordId: number,
    @Body()
    requestBody: UpdateActivityRecordDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityRecordsService.update({ authorizedUser, requestBody, recordId })
  }

  @Delete(":recordId")
  delete(
    @Param("recordId", ParseIntPipe)
    recordId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityRecordsService.delete({ authorizedUser, recordId })
  }
}

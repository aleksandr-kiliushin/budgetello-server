import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"
import { ParseDatesArrayPipe } from "#helpers/parse-dates-array.pipe"
import { ParseNumbersArrayPipe } from "#helpers/parse-numbers-array.pipe"
import { ParseOptionalNumberPipe } from "#helpers/parse-optional-number.pipe"
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
    @Query("boardsIds", ParseNumbersArrayPipe)
    boardsIds: SearchActivityRecordsQueryDto["boardsIds"],
    @Query("categorysIds", ParseNumbersArrayPipe)
    categorysIds: SearchActivityRecordsQueryDto["categorysIds"],
    @Query("dates", ParseDatesArrayPipe)
    dates: SearchActivityRecordsQueryDto["dates"],
    @Query("ids", ParseNumbersArrayPipe)
    ids: SearchActivityRecordsQueryDto["ids"],
    @Query("orderingByDate")
    orderingByDate: SearchActivityRecordsQueryDto["orderingByDate"],
    @Query("orderingById")
    orderingById: SearchActivityRecordsQueryDto["orderingById"],
    @Query("skip", ParseOptionalNumberPipe)
    skip: SearchActivityRecordsQueryDto["skip"],
    @Query("take", ParseOptionalNumberPipe)
    take: SearchActivityRecordsQueryDto["take"],
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.activityRecordsService.search({
      authorizedUser,
      query: { boardsIds, categorysIds, dates, ids, orderingByDate, orderingById, skip, take },
    })
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

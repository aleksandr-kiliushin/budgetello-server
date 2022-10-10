import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/user/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { CreateBudgetingRecordDto } from "./dto/create-budgeting-record.dto"
import { SearchBudgetingRecordsQueryDto } from "./dto/search-budgeting-records-query.dto"
import { UpdateBudgetingRecordDto } from "./dto/update-budgeting-record.dto"
import { budgetingRecordservice } from "./service"

@Controller("budgeting/records")
@UseGuards(AuthGuard)
export class BudgetingRecordsController {
  constructor(private readonly budgetingRecordservice: budgetingRecordservice) {}

  @Get("search")
  search(
    @Query()
    query: SearchBudgetingRecordsQueryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetingRecordservice.search({ authorizedUser, query })
  }

  @Get(":id")
  find(
    @Param("id")
    recordId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetingRecordservice.find({ authorizedUser, recordId: parseInt(recordId) })
  }

  @Post()
  create(
    @Body()
    requestBody: CreateBudgetingRecordDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetingRecordservice.create({ authorizedUser, requestBody })
  }

  @Patch(":id")
  update(
    @Param("id")
    recordId: string,
    @Body()
    requestBody: UpdateBudgetingRecordDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetingRecordservice.update({
      authorizedUser,
      recordId: parseInt(recordId),
      requestBody,
    })
  }

  @Delete(":id")
  delete(
    @Param("id")
    recordId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetingRecordservice.delete({ authorizedUser, recordId: parseInt(recordId) })
  }
}

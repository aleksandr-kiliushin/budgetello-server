import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/user/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { CreateBudgetRecordDto } from "./dto/create-budget-record.dto"
import { SearchBudgetRecordsQueryDto } from "./dto/search-budget-records-query.dto"
import { UpdateBudgetRecordDto } from "./dto/update-budget-record.dto"
import { BudgetRecordsService } from "./service"

@Controller("budget/records")
@UseGuards(AuthGuard)
export class BudgetRecordsController {
  constructor(private readonly budgetRecordsService: BudgetRecordsService) {}

  @Get("search")
  search(
    @Query()
    query: SearchBudgetRecordsQueryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetRecordsService.search({ authorizedUser, query })
  }

  @Get(":id")
  find(
    @Param("id")
    recordId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetRecordsService.find({ authorizedUser, recordId: parseInt(recordId) })
  }

  @Post()
  create(
    @Body()
    requestBody: CreateBudgetRecordDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetRecordsService.create({ authorizedUser, requestBody })
  }

  @Patch(":id")
  update(
    @Param("id")
    recordId: string,
    @Body()
    requestBody: UpdateBudgetRecordDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetRecordsService.update({
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
    return this.budgetRecordsService.delete({ authorizedUser, recordId: parseInt(recordId) })
  }
}

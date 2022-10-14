import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"
import { ValidationPipe } from "#helpers/validator.pipe"

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

  @Get(":recordId")
  find(
    @Param("recordId", ParseIntPipe)
    recordId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetRecordsService.find({ authorizedUser, recordId })
  }

  @Post()
  create(
    @Body(new ValidationPipe())
    requestBody: CreateBudgetRecordDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetRecordsService.create({ authorizedUser, requestBody })
  }

  @Patch(":recordId")
  update(
    @Param("recordId", ParseIntPipe)
    recordId: number,
    @Body()
    requestBody: UpdateBudgetRecordDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetRecordsService.update({ authorizedUser, recordId, requestBody })
  }

  @Delete(":recordId")
  delete(
    @Param("recordId", ParseIntPipe)
    recordId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetRecordsService.delete({ authorizedUser, recordId })
  }
}

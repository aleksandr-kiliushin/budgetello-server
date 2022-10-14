import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"
import { ParseDatesArrayPipe } from "#helpers/parse-dates-array.pipe"
import { ParseNumbersArrayPipe } from "#helpers/parse-numbers-array.pipe"
import { ParseOptionalBooleanPipe } from "#helpers/parse-optional-boolean.pipe"
import { ParseOptionalNumberPipe } from "#helpers/parse-optional-number.pipe"
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
    @Query("amount", ParseOptionalNumberPipe)
    amount: SearchBudgetRecordsQueryDto["amount"],
    @Query("boardsIds", ParseNumbersArrayPipe)
    boardsIds: SearchBudgetRecordsQueryDto["boardsIds"],
    @Query("categoriesIds", ParseNumbersArrayPipe)
    categoriesIds: SearchBudgetRecordsQueryDto["categoriesIds"],
    @Query("dates", ParseDatesArrayPipe)
    dates: SearchBudgetRecordsQueryDto["dates"],
    @Query("ids", ParseNumbersArrayPipe)
    ids: SearchBudgetRecordsQueryDto["ids"],
    @Query("isTrashed", ParseOptionalBooleanPipe)
    isTrashed: SearchBudgetRecordsQueryDto["isTrashed"],
    @Query("orderingByDate")
    orderingByDate: SearchBudgetRecordsQueryDto["orderingByDate"],
    @Query("orderingById")
    orderingById: SearchBudgetRecordsQueryDto["orderingById"],
    @Query("skip", ParseOptionalNumberPipe)
    skip: SearchBudgetRecordsQueryDto["skip"],
    @Query("take", ParseOptionalNumberPipe)
    take: SearchBudgetRecordsQueryDto["take"],
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.budgetRecordsService.search({
      authorizedUser,
      query: { amount, boardsIds, categoriesIds, dates, ids, isTrashed, orderingByDate, orderingById, skip, take },
    })
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

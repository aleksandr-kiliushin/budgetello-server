import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/user/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { CreateFinanceRecordDto } from "./dto/create-finance-record.dto"
import { SearchFinanceRecordsQueryDto } from "./dto/search-finance-records-query.dto"
import { UpdateFinanceRecordDto } from "./dto/update-finance-record.dto"
import { FinanceRecordService } from "./service"

@Controller("finances/records")
@UseGuards(AuthGuard)
export class FinanceRecordController {
  constructor(private readonly financeRecordService: FinanceRecordService) {}

  @Get("search")
  search(
    @Query()
    query: SearchFinanceRecordsQueryDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.financeRecordService.search({ authorizedUser, query })
  }

  @Get(":id")
  find(
    @Param("id")
    recordId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.financeRecordService.find({ authorizedUser, recordId: parseInt(recordId) })
  }

  @Post()
  create(
    @Body()
    createFinanceRecordDto: CreateFinanceRecordDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.financeRecordService.create({ authorizedUser, createFinanceRecordDto })
  }

  @Patch(":id")
  update(
    @Param("id")
    recordId: string,
    @Body()
    updateFinanceRecordDto: UpdateFinanceRecordDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.financeRecordService.update({ authorizedUser, recordId: parseInt(recordId), updateFinanceRecordDto })
  }

  @Delete(":id")
  delete(
    @Param("id")
    recordId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.financeRecordService.delete({ authorizedUser, recordId: parseInt(recordId) })
  }
}

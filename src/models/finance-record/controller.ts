import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { AuthorizedUserId } from "#helpers/AuthorizedUserId.decorator"

import { IUser } from "#interfaces/user"

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
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.financeRecordService.search({ authorizedUserId, query })
  }

  @Get(":id")
  findById(
    @Param("id")
    recordId: string,
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.financeRecordService.findById({ authorizedUserId, recordId: parseInt(recordId) })
  }

  @Post()
  create(
    @Body()
    createFinanceRecordDto: CreateFinanceRecordDto,
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.financeRecordService.create({ authorizedUserId, createFinanceRecordDto })
  }

  @Patch(":id")
  updateFinanceRecord(
    @Param("id")
    recordId: string,
    @Body()
    updateFinanceRecordDto: UpdateFinanceRecordDto,
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.financeRecordService.updateFinanceRecord({
      authorizedUserId,
      recordId: parseInt(recordId),
      updateFinanceRecordDto,
    })
  }

  @Delete(":id")
  deleteFinanceRecord(
    @Param("id")
    recordId: string,
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.financeRecordService.deleteFinanceRecord({ authorizedUserId, recordId: parseInt(recordId) })
  }
}

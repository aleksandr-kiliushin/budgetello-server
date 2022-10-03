import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

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
  search(@Query() query: SearchFinanceRecordsQueryDto) {
    return this.financeRecordService.search(query)
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.financeRecordService.findById(parseInt(id))
  }

  @Post()
  create(
    @Body()
    createFinanceRecordDto: CreateFinanceRecordDto,
    @Request()
    request: Record<string, unknown> & { userId: IUser["id"] }
  ) {
    return this.financeRecordService.create({ authorizedUserId: request.userId, createFinanceRecordDto })
  }

  @Patch(":id")
  updateFinanceRecord(
    @Param("id")
    recordId: string,
    @Body() updateFinanceRecordDto: UpdateFinanceRecordDto,
    @Request()
    request: Record<string, unknown> & { userId: IUser["id"] }
  ) {
    return this.financeRecordService.updateFinanceRecord({
      authorizedUserId: request.userId,
      recordId: parseInt(recordId),
      updateFinanceRecordDto,
    })
  }

  @Delete(":id")
  deleteFinanceRecord(@Param("id") id: string) {
    return this.financeRecordService.deleteFinanceRecord(parseInt(id))
  }
}

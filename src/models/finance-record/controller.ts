import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { CreateFinanceRecordDto } from "./dto/create-finance-record.dto"
import { UpdateFinanceRecordDto } from "./dto/update-finance-record.dto"
import { FinanceRecordService } from "./service"

@Controller("finance-record")
@UseGuards(AuthGuard)
export class FinanceRecordController {
  constructor(private readonly financeRecordService: FinanceRecordService) {}

  @Get()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFinanceRecords(@Query() query: any) {
    return this.financeRecordService.getFinanceRecords(query)
  }

  @Get(":id")
  getFinanceRecord(@Param("id") id: string) {
    return this.financeRecordService.getFinanceRecord(parseInt(id))
  }

  @Post()
  createFinanceRecord(@Body() createFinanceRecordDto: CreateFinanceRecordDto) {
    return this.financeRecordService.createFinanceRecord(createFinanceRecordDto)
  }

  @Patch(":id")
  updateFinanceRecord(@Param("id") id: string, @Body() updateFinanceRecordDto: UpdateFinanceRecordDto) {
    return this.financeRecordService.updateFinanceRecord(parseInt(id), updateFinanceRecordDto)
  }

  @Delete(":id")
  deleteFinanceRecord(@Param("id") id: string) {
    return this.financeRecordService.deleteFinanceRecord(parseInt(id))
  }
}

import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { FinanceCategoryModule } from "#models/finance-category/finance-category.module"

import { FinanceRecordEntity } from "./entities/finance-record.entity"
import { FinanceRecordController } from "./finance-record.controller"
import { FinanceRecordService } from "./finance-record.service"

@Module({
  controllers: [FinanceRecordController],
  imports: [TypeOrmModule.forFeature([FinanceRecordEntity]), FinanceCategoryModule],
  providers: [FinanceRecordController, FinanceRecordService],
})
export class FinanceRecordModule {}

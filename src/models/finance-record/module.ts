import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { FinanceCategoryModule } from "#models/finance-category/module"

import { FinanceRecordController } from "./controller"
import { FinanceRecordEntity } from "./entities/finance-record.entity"
import { FinanceRecordService } from "./service"

@Module({
  controllers: [FinanceRecordController],
  imports: [TypeOrmModule.forFeature([FinanceRecordEntity]), FinanceCategoryModule],
  providers: [FinanceRecordController, FinanceRecordService],
})
export class FinanceRecordModule {}

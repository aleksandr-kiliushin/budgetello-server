import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { BudgetingCategoriesModule } from "#models/budgeting-categories/module"
import { UserModule } from "#models/user/module"

import { BudgetingRecordsController } from "./controller"
import { BudgetingRecordEntity } from "./entities/budgeting-record.entity"
import { budgetingRecordservice } from "./service"

@Module({
  controllers: [BudgetingRecordsController],
  imports: [TypeOrmModule.forFeature([BudgetingRecordEntity]), BudgetingCategoriesModule, UserModule],
  providers: [BudgetingRecordsController, budgetingRecordservice],
})
export class BudgetingRecordsModule {}

import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { BudgetCategoriesModule } from "#models/budget-categories/module"
import { UserModule } from "#models/user/module"

import { BudgetRecordsController } from "./controller"
import { BudgetRecordEntity } from "./entities/budget-record.entity"
import { BudgetRecordsService } from "./service"

@Module({
  controllers: [BudgetRecordsController],
  imports: [TypeOrmModule.forFeature([BudgetRecordEntity]), BudgetCategoriesModule, UserModule],
  providers: [BudgetRecordsController, BudgetRecordsService],
})
export class BudgetRecordsModule {}

import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { BudgetCategoriesModule } from "#models/budget-categories/module"
import { UsersModule } from "#models/users/module"

import { BudgetRecordEntity } from "./entities/budget-record.entity"
import { BudgetRecordsResolver } from "./resolver"
import { BudgetRecordsService } from "./service"

@Module({
  imports: [TypeOrmModule.forFeature([BudgetRecordEntity]), BudgetCategoriesModule, UsersModule],
  providers: [BudgetRecordsResolver, BudgetRecordsService],
})
export class BudgetRecordsModule {}

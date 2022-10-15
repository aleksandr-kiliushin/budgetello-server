import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "#models/users/module"

import { BudgetCategoryTypeEntity } from "./entities/budget-category-type.entity"
import { BudgetCategoryTypesResolver } from "./resolver"
import { BudgetCategoryTypesService } from "./service"

@Module({
  exports: [BudgetCategoryTypesService],
  imports: [TypeOrmModule.forFeature([BudgetCategoryTypeEntity]), UsersModule],
  providers: [BudgetCategoryTypesResolver, BudgetCategoryTypesService],
})
export class BudgetCategoryTypesModule {}

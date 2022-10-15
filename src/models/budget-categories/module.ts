import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { BoardsModule } from "#models/boards/module"
import { BudgetCategoryTypesModule } from "#models/budget-category-types/module"
import { UsersModule } from "#models/users/module"

import { BudgetCategoryEntity } from "./entities/budget-category.entity"
import { BudgetCategoriesResolver } from "./resolver"
import { BudgetCategoriesService } from "./service"

@Module({
  exports: [BudgetCategoriesService],
  imports: [TypeOrmModule.forFeature([BudgetCategoryEntity]), BudgetCategoryTypesModule, BoardsModule, UsersModule],
  providers: [BudgetCategoriesResolver, BudgetCategoriesService],
})
export class BudgetCategoriesModule {}

import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { BoardsModule } from "#models/boards/module"
import { BudgetCategoryTypesModule } from "#models/budget-category-types/module"
import { UserModule } from "#models/user/module"

import { BudgetCategoriesController } from "./controller"
import { BudgetCategoryEntity } from "./entities/budget-category.entity"
import { BudgetCategoriesService } from "./service"

@Module({
  controllers: [BudgetCategoriesController],
  exports: [BudgetCategoriesService],
  imports: [TypeOrmModule.forFeature([BudgetCategoryEntity]), BudgetCategoryTypesModule, BoardsModule, UserModule],
  providers: [BudgetCategoriesController, BudgetCategoriesService],
})
export class BudgetCategoriesModule {}

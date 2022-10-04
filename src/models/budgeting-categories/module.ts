import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { BoardsModule } from "#models/boards/module"
import { BudgetingCategoryTypesModule } from "#models/budgeting-category-types/module"
import { UserModule } from "#models/user/module"

import { BudgetingCategoryController } from "./controller"
import { BudgetingCategoryEntity } from "./entities/budgeting-category.entity"
import { BudgetingCategoryService } from "./service"

@Module({
  controllers: [BudgetingCategoryController],
  exports: [BudgetingCategoryService],
  imports: [
    TypeOrmModule.forFeature([BudgetingCategoryEntity]),
    BudgetingCategoryTypesModule,
    BoardsModule,
    UserModule,
  ],
  providers: [BudgetingCategoryController, BudgetingCategoryService],
})
export class BudgetingCategoriesModule {}

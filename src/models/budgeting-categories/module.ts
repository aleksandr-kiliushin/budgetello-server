import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { BoardsModule } from "#models/boards/module"
import { BudgetingCategoryTypesModule } from "#models/budgeting-category-types/module"
import { UserModule } from "#models/user/module"

import { BudgetingCategoriesController } from "./controller"
import { BudgetingCategoryEntity } from "./entities/budgeting-category.entity"
import { BudgetingCategoriesService } from "./service"

@Module({
  controllers: [BudgetingCategoriesController],
  exports: [BudgetingCategoriesService],
  imports: [
    TypeOrmModule.forFeature([BudgetingCategoryEntity]),
    BudgetingCategoryTypesModule,
    BoardsModule,
    UserModule,
  ],
  providers: [BudgetingCategoriesController, BudgetingCategoriesService],
})
export class BudgetingCategoriesModule {}

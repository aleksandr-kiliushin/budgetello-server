import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "#models/users/module"

import { BudgetCategoryTypesController } from "./controller"
import { BudgetCategoryTypeEntity } from "./entities/budget-category-type.entity"
import { BudgetCategoryTypesService } from "./service"

@Module({
  controllers: [BudgetCategoryTypesController],
  exports: [BudgetCategoryTypesService],
  imports: [TypeOrmModule.forFeature([BudgetCategoryTypeEntity]), UsersModule],
  providers: [BudgetCategoryTypesController, BudgetCategoryTypesService],
})
export class BudgetCategoryTypesModule {}

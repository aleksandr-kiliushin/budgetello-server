import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UserModule } from "#models/user/module"

import { BudgetCategoryTypesController } from "./controller"
import { BudgetCategoryTypeEntity } from "./entities/budget-category-type.entity"
import { BudgetCategoryTypesService } from "./service"

@Module({
  controllers: [BudgetCategoryTypesController],
  exports: [BudgetCategoryTypesService],
  imports: [TypeOrmModule.forFeature([BudgetCategoryTypeEntity]), UserModule],
  providers: [BudgetCategoryTypesController, BudgetCategoryTypesService],
})
export class BudgetCategoryTypesModule {}

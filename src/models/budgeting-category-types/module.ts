import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UserModule } from "#models/user/module"

import { BudgetingCategoryTypesController } from "./controller"
import { BudgetingCategoryTypeEntity } from "./entities/budgeting-category-type.entity"
import { BudgetingCategoryTypesService } from "./service"

@Module({
  controllers: [BudgetingCategoryTypesController],
  exports: [BudgetingCategoryTypesService],
  imports: [TypeOrmModule.forFeature([BudgetingCategoryTypeEntity]), UserModule],
  providers: [BudgetingCategoryTypesController, BudgetingCategoryTypesService],
})
export class BudgetingCategoryTypesModule {}

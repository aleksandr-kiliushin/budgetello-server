import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UserModule } from "#models/user/module"

import { BudgetingCategoryTypeController } from "./controller"
import { BudgetingCategoryTypeEntity } from "./entities/budgeting-category-type.entity"
import { BudgetingCategoryTypeService } from "./service"

@Module({
  controllers: [BudgetingCategoryTypeController],
  exports: [BudgetingCategoryTypeService],
  imports: [TypeOrmModule.forFeature([BudgetingCategoryTypeEntity]), UserModule],
  providers: [BudgetingCategoryTypeController, BudgetingCategoryTypeService],
})
export class BudgetingCategoryTypesModule {}

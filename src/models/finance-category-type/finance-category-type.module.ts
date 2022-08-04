import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { FinanceCategoryTypeEntity } from "./entities/finance-category-type.entity"
import { FinanceCategoryTypeController } from "./finance-category-type.controller"
import { FinanceCategoryTypeService } from "./finance-category-type.service"

@Module({
  exports: [FinanceCategoryTypeService],
  imports: [TypeOrmModule.forFeature([FinanceCategoryTypeEntity])],
  providers: [FinanceCategoryTypeController, FinanceCategoryTypeService], // Try to delete.
  controllers: [FinanceCategoryTypeController], // Try to delete.
})
export class FinanceCategoryTypeModule {}

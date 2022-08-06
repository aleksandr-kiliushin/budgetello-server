import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { FinanceCategoryTypeController } from "./controller"
import { FinanceCategoryTypeEntity } from "./entities/finance-category-type.entity"
import { FinanceCategoryTypeService } from "./service"

@Module({
  exports: [FinanceCategoryTypeService],
  imports: [TypeOrmModule.forFeature([FinanceCategoryTypeEntity])],
  providers: [FinanceCategoryTypeController, FinanceCategoryTypeService], // Try to delete.
  controllers: [FinanceCategoryTypeController], // Try to delete.
})
export class FinanceCategoryTypeModule {}

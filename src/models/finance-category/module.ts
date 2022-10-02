import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { BoardsModule } from "#models/boards/module"
import { FinanceCategoryTypeModule } from "#models/finance-category-type/module"

import { FinanceCategoryController } from "./controller"
import { FinanceCategoryEntity } from "./entities/finance-category.entity"
import { FinanceCategoryService } from "./service"

@Module({
  exports: [FinanceCategoryService],
  imports: [TypeOrmModule.forFeature([FinanceCategoryEntity]), FinanceCategoryTypeModule, BoardsModule],
  providers: [FinanceCategoryController, FinanceCategoryService],
  controllers: [FinanceCategoryController],
})
export class FinanceCategoryModule {}

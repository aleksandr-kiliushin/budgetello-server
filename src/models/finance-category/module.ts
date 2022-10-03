import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { BoardsModule } from "#models/boards/module"
import { FinanceCategoryTypeModule } from "#models/finance-category-type/module"
import { UserModule } from "#models/user/module"

import { FinanceCategoryController } from "./controller"
import { FinanceCategoryEntity } from "./entities/finance-category.entity"
import { FinanceCategoryService } from "./service"

@Module({
  controllers: [FinanceCategoryController],
  exports: [FinanceCategoryService],
  imports: [TypeOrmModule.forFeature([FinanceCategoryEntity]), FinanceCategoryTypeModule, BoardsModule, UserModule],
  providers: [FinanceCategoryController, FinanceCategoryService],
})
export class FinanceCategoryModule {}

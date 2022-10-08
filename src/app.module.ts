import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { ActivityCategoriesModule } from "#models/activity-categories/module"
import { AuthModule } from "#models/auth/module"
import { BoardSubjectsModule } from "#models/board-subjects/module"
import { BoardsModule } from "#models/boards/module"
import { BudgetingCategoriesModule } from "#models/budgeting-categories/module"
import { BudgetingCategoryTypesModule } from "#models/budgeting-category-types/module"
import { BudgetingRecordsModule } from "#models/budgeting-records/module"

import { ormConfig } from "./config/ormConfig"
import { UserModule } from "./models/user/module"

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ActivityCategoriesModule,
    AuthModule,
    BoardsModule,
    BoardSubjectsModule,
    BudgetingCategoriesModule,
    BudgetingCategoryTypesModule,
    BudgetingRecordsModule,
    UserModule,
  ],
})
export class AppModule {}

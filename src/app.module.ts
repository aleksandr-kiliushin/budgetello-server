import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { ActivityCategoriesModule } from "#models/activity-categories/module"
import { ActivityCategoryMeasurementTypesModule } from "#models/activity-category-measurement-types/module"
import { ActivityRecordsModule } from "#models/activity-records/module"
import { AuthModule } from "#models/auth/module"
import { BoardSubjectsModule } from "#models/board-subjects/module"
import { BoardsModule } from "#models/boards/module"
import { BudgetCategoriesModule } from "#models/budget-categories/module"
import { BudgetCategoryTypesModule } from "#models/budget-category-types/module"
import { BudgetRecordsModule } from "#models/budget-records/module"

import { ormConfig } from "./config/ormConfig"
import { UserModule } from "./models/user/module"

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ActivityCategoriesModule,
    ActivityCategoryMeasurementTypesModule,
    ActivityRecordsModule,
    AuthModule,
    BoardsModule,
    BoardSubjectsModule,
    BudgetCategoriesModule,
    BudgetCategoryTypesModule,
    BudgetRecordsModule,
    UserModule,
  ],
})
export class AppModule {}

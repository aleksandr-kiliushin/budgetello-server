import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { TypeOrmModule } from "@nestjs/typeorm"
import { join } from "node:path"

import { ActivityCategoriesModule } from "#models/activity-categories/module"
import { ActivityCategoryMeasurementTypesModule } from "#models/activity-category-measurement-types/module"
import { ActivityRecordsModule } from "#models/activity-records/module"
import { AuthorizationModule } from "#models/authorization/module"
import { BoardSubjectsModule } from "#models/board-subjects/module"
import { BoardsModule } from "#models/boards/module"
import { BudgetCategoriesModule } from "#models/budget-categories/module"
import { BudgetCategoryTypesModule } from "#models/budget-category-types/module"
import { BudgetRecordsModule } from "#models/budget-records/module"
import { UsersModule } from "#models/users/module"

import { ormConfig } from "./config/ormConfig"

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      cache: "bounded",
      driver: ApolloDriver,
      sortSchema: true,
    }),
    ActivityCategoriesModule,
    ActivityCategoryMeasurementTypesModule,
    ActivityRecordsModule,
    AuthorizationModule,
    BoardsModule,
    BoardSubjectsModule,
    BudgetCategoriesModule,
    BudgetCategoryTypesModule,
    BudgetRecordsModule,
    UsersModule,
  ],
})
export class AppModule {}

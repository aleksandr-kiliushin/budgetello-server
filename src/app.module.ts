import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { TypeOrmModule } from "@nestjs/typeorm"
import { join } from "node:path"

import { ActivityCategoriesModule } from "#models/activity-categories/module"
import { ActivityCategoryMeasurementTypesModule } from "#models/activity-category-measurement-types/module"
import { ActivityRecordsModule } from "#models/activity-records/module"
import { AuthModule } from "#models/auth/module"
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
    /**
     * TODO: Delete comment after work done.
     * In some circumstances (for example end-to-end tests), you may want to get a reference to the generated schema object.
     * https://docs.nestjs.com/graphql/quick-start#accessing-generated-schema
     */
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      driver: ApolloDriver,
      /**
       * TODO: Delete comment after work done.
       * To use Apollo Sandbox instead of the graphql-playground as a GraphQL IDE for local development, use the following configuration:
       * // import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
       * // plugins: [ApolloServerPluginLandingPageLocalDefault()],
       */
      sortSchema: true,
    }),
    ActivityCategoriesModule,
    ActivityCategoryMeasurementTypesModule,
    ActivityRecordsModule,
    AuthModule,
    BoardsModule,
    BoardSubjectsModule,
    BudgetCategoriesModule,
    BudgetCategoryTypesModule,
    BudgetRecordsModule,
    UsersModule,
  ],
})
export class AppModule {}

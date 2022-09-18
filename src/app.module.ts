import { Module } from "@nestjs/common"
import { SequelizeModule } from "@nestjs/sequelize"

import { AuthModule } from "#models/auth/module"
import { FinanceCategoryTypeModule } from "#models/finance-category-type/module"
import { FinanceCategoryModule } from "#models/finance-category/module"
import { FinanceRecordModule } from "#models/finance-record/module"

import { ormConfig } from "./config/ormConfig"
import { UserModule } from "./models/user/module"

@Module({
  imports: [
    SequelizeModule.forRoot(ormConfig),
    AuthModule,
    FinanceCategoryModule,
    FinanceCategoryTypeModule,
    FinanceRecordModule,
    UserModule,
  ],
})
export class AppModule {}

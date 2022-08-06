import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AuthModule } from "#models/auth/module"
import { FinanceCategoryTypeModule } from "#models/finance-category-type/module"
import { FinanceCategoryModule } from "#models/finance-category/module"
import { FinanceRecordModule } from "#models/finance-record/module"

import { ormConfig } from "./config/ormConfig"
import { UserModule } from "./models/user/module"

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    AuthModule,
    FinanceCategoryModule,
    FinanceCategoryTypeModule,
    FinanceRecordModule,
    UserModule,
  ],
})
export class AppModule {}

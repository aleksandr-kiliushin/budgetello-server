import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "#models/users/module"

import { CurrencyEntity } from "./entities/currency.entity"
import { CurrenciesResolver } from "./resolver"
import { CurrenciesService } from "./service"

@Module({
  exports: [CurrenciesService],
  imports: [TypeOrmModule.forFeature([CurrencyEntity]), UsersModule],
  providers: [CurrenciesResolver, CurrenciesService],
})
export class CurrenciesModule {}

import { UseGuards } from "@nestjs/common"
import { Args, Query, Resolver } from "@nestjs/graphql"

import { AuthorizationGuard } from "#helpers/authorization.guard"

import { ICurrency } from "#interfaces/currencies"

import { CurrencyEntity } from "./entities/currency.entity"
import { Currency } from "./models/currency.model"
import { CurrenciesService } from "./service"

@Resolver(() => Currency)
@UseGuards(AuthorizationGuard)
export class CurrenciesResolver {
  constructor(private currenciesService: CurrenciesService) {}

  @Query((returns) => [Currency], { name: "currencies" })
  getAll(): Promise<CurrencyEntity[]> {
    return this.currenciesService.getAll()
  }

  @Query((returns) => Currency, { name: "currency" })
  find(
    @Args("slug", { type: () => String })
    currencySlug: ICurrency["slug"]
  ): Promise<CurrencyEntity> {
    return this.currenciesService.find({ currencySlug })
  }
}

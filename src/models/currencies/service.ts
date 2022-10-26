import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { CurrencyEntity } from "./entities/currency.entity"

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(CurrencyEntity)
    private currenciesRepository: Repository<CurrencyEntity>
  ) {}

  getAll(): Promise<CurrencyEntity[]> {
    return this.currenciesRepository.find()
  }

  find({ currencySlug }: { currencySlug: CurrencyEntity["slug"] }): Promise<CurrencyEntity> {
    return this.currenciesRepository.findOneOrFail({ where: { slug: currencySlug } })
  }
}

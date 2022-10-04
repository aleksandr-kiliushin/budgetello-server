import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { FinanceCategoryTypeEntity } from "./entities/finance-category-type.entity"

@Injectable()
export class FinanceCategoryTypeService {
  constructor(
    @InjectRepository(FinanceCategoryTypeEntity)
    private financeCategoryTypeRepository: Repository<FinanceCategoryTypeEntity>
  ) {}

  getAll(): Promise<FinanceCategoryTypeEntity[]> {
    return this.financeCategoryTypeRepository.find()
  }

  find({
    financeCategoryTypeId,
  }: {
    financeCategoryTypeId: FinanceCategoryTypeEntity["id"]
  }): Promise<FinanceCategoryTypeEntity> {
    return this.financeCategoryTypeRepository.findOneOrFail({ where: { id: financeCategoryTypeId } })
  }
}

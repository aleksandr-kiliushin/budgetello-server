import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { BudgetCategoryTypeEntity } from "./entities/budget-category-type.entity"

@Injectable()
export class BudgetCategoryTypesService {
  constructor(
    @InjectRepository(BudgetCategoryTypeEntity)
    private budgetCategoryTypesRepository: Repository<BudgetCategoryTypeEntity>
  ) {}

  getAll(): Promise<BudgetCategoryTypeEntity[]> {
    return this.budgetCategoryTypesRepository.find()
  }

  find({ typeId }: { typeId: BudgetCategoryTypeEntity["id"] }): Promise<BudgetCategoryTypeEntity> {
    return this.budgetCategoryTypesRepository.findOneOrFail({ where: { id: typeId } })
  }
}

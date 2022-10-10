import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { BudgetCategoryTypeEntity } from "./entities/budget-category-type.entity"

@Injectable()
export class BudgetCategoryTypesService {
  constructor(
    @InjectRepository(BudgetCategoryTypeEntity)
    private budgetCategoryTypeRepository: Repository<BudgetCategoryTypeEntity>
  ) {}

  getAll(): Promise<BudgetCategoryTypeEntity[]> {
    return this.budgetCategoryTypeRepository.find()
  }

  find({ categoryTypeId }: { categoryTypeId: BudgetCategoryTypeEntity["id"] }): Promise<BudgetCategoryTypeEntity> {
    return this.budgetCategoryTypeRepository.findOneOrFail({ where: { id: categoryTypeId } })
  }
}

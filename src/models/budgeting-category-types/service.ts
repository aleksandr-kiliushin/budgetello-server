import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { BudgetingCategoryTypeEntity } from "./entities/budgeting-category-type.entity"

@Injectable()
export class BudgetingCategoryTypesService {
  constructor(
    @InjectRepository(BudgetingCategoryTypeEntity)
    private budgetingCategoryTypeRepository: Repository<BudgetingCategoryTypeEntity>
  ) {}

  getAll(): Promise<BudgetingCategoryTypeEntity[]> {
    return this.budgetingCategoryTypeRepository.find()
  }

  find({
    categoryTypeId,
  }: {
    categoryTypeId: BudgetingCategoryTypeEntity["id"]
  }): Promise<BudgetingCategoryTypeEntity> {
    return this.budgetingCategoryTypeRepository.findOneOrFail({ where: { id: categoryTypeId } })
  }
}

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { FinanceCategoryTypeService } from "#models/finance-category-type/finance-category-type.service"

import { CreateFinanceCategoryDto } from "./dto/create-finance-category.dto"
import { UpdateFinanceCategoryDto } from "./dto/update-finance-category.dto"
import { FinanceCategoryEntity } from "./entities/finance-category.entity"

@Injectable()
export class FinanceCategoryService {
  constructor(
    @InjectRepository(FinanceCategoryEntity)
    private financeCategoryRepository: Repository<FinanceCategoryEntity>,

    private financeCategoryTypeService: FinanceCategoryTypeService
  ) {}

  getFinanceCategories(query: { ids: string }): Promise<FinanceCategoryEntity[]> {
    const { ids } = query
    const where = {
      ...(ids && { id: In(ids.split(",")) }),
    }
    return this.financeCategoryRepository.find({
      order: {
        id: "ASC",
        name: "ASC",
      },
      relations: ["type"],
      where,
    })
  }

  getFinanceCategory(id: FinanceCategoryEntity["id"]): Promise<FinanceCategoryEntity> {
    return this.financeCategoryRepository.findOneOrFail({
      relations: ["type"],
      where: { id },
    })
  }

  async createFinanceCategory(createFinanceCategoryDto: CreateFinanceCategoryDto): Promise<FinanceCategoryEntity> {
    const { typeId, name } = createFinanceCategoryDto

    const type = await this.financeCategoryTypeService.getFinanceCategoryType(typeId)

    const category = this.financeCategoryRepository.create({ name, type })

    return this.financeCategoryRepository.save(category)
  }

  async updateFinanceCategory(
    id: FinanceCategoryEntity["id"],
    updateFinanceCategoryDto: UpdateFinanceCategoryDto
  ): Promise<FinanceCategoryEntity> {
    const { typeId, name } = updateFinanceCategoryDto

    const category = await this.getFinanceCategory(id)

    if (typeId) {
      const type = await this.financeCategoryTypeService.getFinanceCategoryType(typeId)
      category.type = type
    }

    if (name) {
      category.name = name
    }

    return this.financeCategoryRepository.save(category)
  }

  async deleteFinanceCategory(id: FinanceCategoryEntity["id"]): Promise<FinanceCategoryEntity> {
    const category = await this.getFinanceCategory(id)

    await this.financeCategoryRepository.delete(id)

    return category
  }
}

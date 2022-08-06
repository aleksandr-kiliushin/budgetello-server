import { Injectable, NotFoundException } from "@nestjs/common"
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

  searchCategories(query: { id: string }): Promise<FinanceCategoryEntity[]> {
    return this.financeCategoryRepository.find({
      order: {
        id: "ASC",
        name: "ASC",
      },
      relations: ["type"],
      where: {
        ...(query.id && { id: In(query.id.split(",")) }),
      },
    })
  }

  async findById(id: FinanceCategoryEntity["id"]): Promise<FinanceCategoryEntity> {
    const category = await this.financeCategoryRepository.findOne({ relations: ["type"], where: { id } })
    if (category === null) throw new NotFoundException({})
    return category
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

    const category = await this.findById(id)

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
    const category = await this.findById(id)
    await this.financeCategoryRepository.delete(id)
    return category
  }
}

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { FinanceCategoryTypeEntity } from "#models/finance-category-type/entities/finance-category-type.entity"
import { FinanceCategoryTypeService } from "#models/finance-category-type/service"

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
        ...(query.id === undefined ? {} : { id: In(query.id.split(",")) }),
      },
    })
  }

  async findById(id: FinanceCategoryEntity["id"]): Promise<FinanceCategoryEntity> {
    const category = await this.financeCategoryRepository.findOne({ relations: ["type"], where: { id } })
    if (category === null) throw new NotFoundException({})
    return category
  }

  async create(createFinanceCategoryDto: CreateFinanceCategoryDto): Promise<FinanceCategoryEntity> {
    const { name, typeId } = createFinanceCategoryDto
    if (name === undefined || name === "") throw new BadRequestException({ fields: { name: "Required field." } })
    if (typeId === undefined) {
      throw new BadRequestException({ fields: { typeId: "Required field." } })
    }
    let type: FinanceCategoryTypeEntity | undefined
    try {
      type = await this.financeCategoryTypeService.findById(typeId)
    } catch {
      throw new BadRequestException({ fields: { typeId: "Invalid category type." } })
    }
    const theSameExistingCategory = await this.financeCategoryRepository.findOne({
      relations: ["type"],
      where: { name, type },
    })
    if (theSameExistingCategory !== null) {
      throw new BadRequestException({
        fields: {
          name: `"${theSameExistingCategory.name}" ${theSameExistingCategory.type.name} category already exists.`,
          typeId: `"${theSameExistingCategory.name}" ${theSameExistingCategory.type.name} category already exists.`,
        },
      })
    }
    const category = this.financeCategoryRepository.create({ name, type })
    return this.financeCategoryRepository.save(category)
  }

  async update(
    id: FinanceCategoryEntity["id"],
    updateFinanceCategoryDto: UpdateFinanceCategoryDto
  ): Promise<FinanceCategoryEntity> {
    const { name, typeId } = updateFinanceCategoryDto
    const category = await this.findById(id)
    if (typeId !== undefined) {
      try {
        const type = await this.financeCategoryTypeService.findById(typeId)
        category.type = type
      } catch {
        throw new BadRequestException({ fields: { typeId: "Invalid category type." } })
      }
    }
    if (name !== undefined) {
      if (name === "") throw new BadRequestException({ fields: { name: "Category name cannot be empty." } })
      category.name = name
    }
    return this.financeCategoryRepository.save(category)
  }

  async delete(id: FinanceCategoryEntity["id"]): Promise<FinanceCategoryEntity> {
    const category = await this.findById(id)
    await this.financeCategoryRepository.delete(id)
    return category
  }
}

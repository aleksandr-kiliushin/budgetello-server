import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { FinanceCategoryTypeEntity } from "#models/finance-category-type/entities/finance-category-type.entity"
import { FinanceCategoryTypeService } from "#models/finance-category-type/service"
import { GroupEntity } from "#models/groups/entities/group.entity"
import { GroupsService } from "#models/groups/service"

import { CreateFinanceCategoryDto } from "./dto/create-finance-category.dto"
import { SearchFinanceCategoriesQueryDto } from "./dto/seach-finance-categories-query.dto"
import { UpdateFinanceCategoryDto } from "./dto/update-finance-category.dto"
import { FinanceCategoryEntity } from "./entities/finance-category.entity"

@Injectable()
export class FinanceCategoryService {
  constructor(
    @InjectRepository(FinanceCategoryEntity)
    private financeCategoryRepository: Repository<FinanceCategoryEntity>,
    private financeCategoryTypeService: FinanceCategoryTypeService,
    private groupsService: GroupsService
  ) {}

  searchCategories(query: SearchFinanceCategoriesQueryDto): Promise<FinanceCategoryEntity[]> {
    return this.financeCategoryRepository.find({
      order: { id: "ASC", name: "ASC" },
      relations: { group: true, type: true },
      where: {
        ...(query.id !== undefined && { id: In(query.id.split(",")) }),
        ...(query.groupId !== undefined && { group: In(query.groupId.split(",")) }),
      },
    })
  }

  async findById(id: FinanceCategoryEntity["id"]): Promise<FinanceCategoryEntity> {
    const category = await this.financeCategoryRepository.findOne({
      relations: { group: true, type: true },
      where: { id },
    })
    if (category === null) throw new NotFoundException({})
    return category
  }

  async create(createFinanceCategoryDto: CreateFinanceCategoryDto): Promise<FinanceCategoryEntity> {
    const { groupId, name, typeId } = createFinanceCategoryDto
    if (name === undefined || name === "") throw new BadRequestException({ fields: { name: "Required field." } })
    if (typeId === undefined) {
      throw new BadRequestException({ fields: { typeId: "Required field." } })
    }
    if (groupId === undefined) {
      throw new BadRequestException({ fields: { groupId: "Required field." } })
    }
    let type: FinanceCategoryTypeEntity | undefined
    try {
      type = await this.financeCategoryTypeService.findById(typeId)
    } catch {
      throw new BadRequestException({ fields: { typeId: "Invalid category type." } })
    }
    let group: GroupEntity | undefined
    try {
      group = await this.groupsService.findById(groupId)
    } catch {
      throw new BadRequestException({ fields: { groupId: "Invalid group." } })
    }
    const theSameExistingCategory = await this.financeCategoryRepository.findOne({
      relations: { group: true, type: true },
      where: { group, name, type },
    })
    if (theSameExistingCategory !== null) {
      throw new BadRequestException({
        fields: {
          groupId: `"${theSameExistingCategory.name}" ${theSameExistingCategory.type.name} category already exists in this group.`,
          name: `"${theSameExistingCategory.name}" ${theSameExistingCategory.type.name} category already exists in this group.`,
          typeId: `"${theSameExistingCategory.name}" ${theSameExistingCategory.type.name} category already exists in this group.`,
        },
      })
    }
    const category = this.financeCategoryRepository.create({ group, name, type })
    const { id: createdCategoryId } = await this.financeCategoryRepository.save(category)
    return await this.findById(createdCategoryId)
  }

  async update(
    id: FinanceCategoryEntity["id"],
    updateFinanceCategoryDto: UpdateFinanceCategoryDto
  ): Promise<FinanceCategoryEntity> {
    const { groupId, name, typeId } = updateFinanceCategoryDto
    const category = await this.findById(id)
    if (groupId === undefined && name === undefined && typeId === undefined) return category
    if (typeId !== undefined) {
      try {
        category.type = await this.financeCategoryTypeService.findById(typeId)
      } catch {
        throw new BadRequestException({ fields: { typeId: "Invalid category type." } })
      }
    }
    if (groupId !== undefined) {
      try {
        category.group = await this.groupsService.findById(groupId)
      } catch {
        throw new BadRequestException({ fields: { groupId: "Invalid group." } })
      }
    }
    if (name !== undefined) {
      if (name === "") throw new BadRequestException({ fields: { name: "Category name cannot be empty." } })
      category.name = name
    }
    const theSameExistingCategory = await this.financeCategoryRepository.findOne({
      relations: { group: true, type: true },
      where: { group: category.group, name: category.name, type: category.type },
    })
    if (theSameExistingCategory !== null) {
      throw new BadRequestException({
        fields: {
          groupId: `"${theSameExistingCategory.name}" ${theSameExistingCategory.type.name} category already exists in this group.`,
          name: `"${theSameExistingCategory.name}" ${theSameExistingCategory.type.name} category already exists in this group.`,
          typeId: `"${theSameExistingCategory.name}" ${theSameExistingCategory.type.name} category already exists in this group.`,
        },
      })
    }
    await this.financeCategoryRepository.save(category)
    return await this.findById(id)
  }

  async delete(id: FinanceCategoryEntity["id"]): Promise<FinanceCategoryEntity> {
    const category = await this.findById(id)
    await this.financeCategoryRepository.delete(id)
    return category
  }
}

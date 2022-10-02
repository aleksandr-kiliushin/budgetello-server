import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { BoardEntity } from "#models/boards/entities/board.entity"
import { BoardsService } from "#models/boards/service"
import { FinanceCategoryTypeEntity } from "#models/finance-category-type/entities/finance-category-type.entity"
import { FinanceCategoryTypeService } from "#models/finance-category-type/service"

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
    private boardsService: BoardsService
  ) {}

  searchCategories(query: SearchFinanceCategoriesQueryDto): Promise<FinanceCategoryEntity[]> {
    return this.financeCategoryRepository.find({
      order: { id: "ASC", name: "ASC" },
      relations: { board: true, type: true },
      where: {
        ...(query.id !== undefined && { id: In(query.id.split(",")) }),
        ...(query.boardId !== undefined && { board: In(query.boardId.split(",")) }),
      },
    })
  }

  async findById(id: FinanceCategoryEntity["id"]): Promise<FinanceCategoryEntity> {
    const category = await this.financeCategoryRepository.findOne({
      relations: { board: true, type: true },
      where: { id },
    })
    if (category === null) throw new NotFoundException({})
    return category
  }

  async create(createFinanceCategoryDto: CreateFinanceCategoryDto): Promise<FinanceCategoryEntity> {
    const { boardId, name, typeId } = createFinanceCategoryDto
    if (name === undefined || name === "") throw new BadRequestException({ fields: { name: "Required field." } })
    if (typeId === undefined) {
      throw new BadRequestException({ fields: { typeId: "Required field." } })
    }
    if (boardId === undefined) {
      throw new BadRequestException({ fields: { boardId: "Required field." } })
    }
    let type: FinanceCategoryTypeEntity | undefined
    try {
      type = await this.financeCategoryTypeService.findById(typeId)
    } catch {
      throw new BadRequestException({ fields: { typeId: "Invalid category type." } })
    }
    let board: BoardEntity | undefined
    try {
      board = await this.boardsService.findById(boardId)
    } catch {
      throw new BadRequestException({ fields: { boardId: "Invalid board." } })
    }
    const theSameExistingCategory = await this.financeCategoryRepository.findOne({
      relations: { board: true, type: true },
      where: { board, name, type },
    })
    if (theSameExistingCategory !== null) {
      throw new BadRequestException({
        fields: {
          boardId: `"${theSameExistingCategory.name}" ${theSameExistingCategory.type.name} category already exists in this board.`,
          name: `"${theSameExistingCategory.name}" ${theSameExistingCategory.type.name} category already exists in this board.`,
          typeId: `"${theSameExistingCategory.name}" ${theSameExistingCategory.type.name} category already exists in this board.`,
        },
      })
    }
    const category = this.financeCategoryRepository.create({ board, name, type })
    const { id: createdCategoryId } = await this.financeCategoryRepository.save(category)
    return await this.findById(createdCategoryId)
  }

  async update(
    id: FinanceCategoryEntity["id"],
    updateFinanceCategoryDto: UpdateFinanceCategoryDto
  ): Promise<FinanceCategoryEntity> {
    const { boardId, name, typeId } = updateFinanceCategoryDto
    const category = await this.findById(id)
    if (boardId === undefined && name === undefined && typeId === undefined) return category
    if (typeId !== undefined) {
      try {
        category.type = await this.financeCategoryTypeService.findById(typeId)
      } catch {
        throw new BadRequestException({ fields: { typeId: "Invalid category type." } })
      }
    }
    if (boardId !== undefined) {
      try {
        category.board = await this.boardsService.findById(boardId)
      } catch {
        throw new BadRequestException({ fields: { boardId: "Invalid board." } })
      }
    }
    if (name !== undefined) {
      if (name === "") throw new BadRequestException({ fields: { name: "Category name cannot be empty." } })
      category.name = name
    }
    const theSameExistingCategory = await this.financeCategoryRepository.findOne({
      relations: { board: true, type: true },
      where: { board: category.board, name: category.name, type: category.type },
    })
    if (theSameExistingCategory !== null) {
      throw new BadRequestException({
        fields: {
          boardId: `"${theSameExistingCategory.name}" ${theSameExistingCategory.type.name} category already exists in this board.`,
          name: `"${theSameExistingCategory.name}" ${theSameExistingCategory.type.name} category already exists in this board.`,
          typeId: `"${theSameExistingCategory.name}" ${theSameExistingCategory.type.name} category already exists in this board.`,
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

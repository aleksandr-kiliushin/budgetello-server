import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { BoardsService } from "#models/boards/service"
import { BudgetCategoryTypesService } from "#models/budget-category-types/service"
import { UserEntity } from "#models/user/entities/user.entity"

import { CreateBudgetCategoryDto } from "./dto/create-budget-category.dto"
import { SearchBudgetCategoriesQueryDto } from "./dto/seach-budget-categories-query.dto"
import { UpdateBudgetCategoryDto } from "./dto/update-budget-category.dto"
import { BudgetCategoryEntity } from "./entities/budget-category.entity"

@Injectable()
export class BudgetCategoriesService {
  constructor(
    @InjectRepository(BudgetCategoryEntity)
    private budgetCategoriesRepository: Repository<BudgetCategoryEntity>,
    private budgetCategoryTypesService: BudgetCategoryTypesService,
    private boardsService: BoardsService
  ) {}

  async search({
    authorizedUser,
    query,
  }: {
    authorizedUser: UserEntity
    query: SearchBudgetCategoriesQueryDto
  }): Promise<BudgetCategoryEntity[]> {
    const accessibleBoardsIds = [
      ...new Set([
        ...authorizedUser.administratedBoards.map((board) => board.id),
        ...authorizedUser.boards.map((board) => board.id),
      ]),
    ]
    const boardsIdsToSearchWith =
      query.boardId === undefined
        ? accessibleBoardsIds
        : query.boardId
            .split(",")
            .map((boardId) => parseInt(boardId))
            .filter((boardIdFromQuery) => accessibleBoardsIds.includes(boardIdFromQuery))

    return this.budgetCategoriesRepository.find({
      order: { id: "ASC", name: "ASC" },
      relations: { board: true, type: true },
      where: {
        ...(query.id !== undefined && { id: In(query.id.split(",")) }),
        board: { id: In(boardsIdsToSearchWith) },
      },
    })
  }

  async find({
    authorizedUser,
    categoryId,
  }: {
    authorizedUser: UserEntity
    categoryId: BudgetCategoryEntity["id"]
  }): Promise<BudgetCategoryEntity> {
    const category = await this.budgetCategoriesRepository.findOne({
      relations: { board: true, type: true },
      where: { id: categoryId },
    })
    if (category === null) throw new NotFoundException({})

    const isAuthorizedUserBoardAdmin = authorizedUser.administratedBoards.some((board) => {
      return board.id === category.board.id
    })
    const isAuthorizedUserBoardMember = authorizedUser.boards.some((board) => board.id === category.board.id)
    const canAuthorizedUserEditThisCategory = isAuthorizedUserBoardAdmin || isAuthorizedUserBoardMember
    if (!canAuthorizedUserEditThisCategory) {
      throw new ForbiddenException({ message: "Access denied." })
    }

    return category
  }

  async create({
    authorizedUser,
    requestBody,
  }: {
    authorizedUser: UserEntity
    requestBody: CreateBudgetCategoryDto
  }): Promise<BudgetCategoryEntity> {
    const type = await this.budgetCategoryTypesService.find({ typeId: requestBody.typeId }).catch(() => {
      throw new BadRequestException({ fields: { typeId: "Invalid value." } })
    })
    const board = await this.boardsService.find({ boardId: requestBody.boardId }).catch(() => {
      throw new BadRequestException({ fields: { boardId: "Invalid value." } })
    })
    const similarExistingCategory = await this.budgetCategoriesRepository.findOne({
      relations: { board: true, type: true },
      where: { board, name: requestBody.name, type },
    })
    if (similarExistingCategory !== null) {
      throw new BadRequestException({
        fields: {
          boardId: `"${similarExistingCategory.name}" ${similarExistingCategory.type.name} category already exists in this board.`,
          name: `"${similarExistingCategory.name}" ${similarExistingCategory.type.name} category already exists in this board.`,
          typeId: `"${similarExistingCategory.name}" ${similarExistingCategory.type.name} category already exists in this board.`,
        },
      })
    }
    const category = this.budgetCategoriesRepository.create({ board, name: requestBody.name, type })
    const createdCategory = await this.budgetCategoriesRepository.save(category)
    return await this.find({ authorizedUser, categoryId: createdCategory.id })
  }

  async update({
    authorizedUser,
    categoryId,
    requestBody,
  }: {
    authorizedUser: UserEntity
    categoryId: BudgetCategoryEntity["id"]
    requestBody: UpdateBudgetCategoryDto
  }): Promise<BudgetCategoryEntity> {
    const category = await this.find({ authorizedUser, categoryId })

    const isAuthorizedUserBoardAdmin = authorizedUser.administratedBoards.some((board) => {
      return board.id === category.board.id
    })
    const isAuthorizedUserBoardMember = authorizedUser.boards.some((board) => board.id === category.board.id)
    const canAuthorizedUserEditThisCategory = isAuthorizedUserBoardAdmin || isAuthorizedUserBoardMember
    if (!canAuthorizedUserEditThisCategory) {
      throw new ForbiddenException({ message: "Access denied." })
    }

    if (Object.keys(requestBody).length === 0) return category

    if (requestBody.typeId !== undefined) {
      category.type = await this.budgetCategoryTypesService.find({ typeId: requestBody.typeId }).catch(() => {
        throw new BadRequestException({ fields: { typeId: "Invalid value." } })
      })
    }
    if (requestBody.boardId !== undefined) {
      category.board = await this.boardsService.find({ boardId: requestBody.boardId }).catch(() => {
        throw new BadRequestException({ fields: { boardId: "Invalid value." } })
      })
    }
    if (requestBody.name !== undefined) {
      if (requestBody.name === "") {
        throw new BadRequestException({ fields: { name: "Category name cannot be empty." } })
      }
      category.name = requestBody.name
    }
    const similarExistingCategory = await this.budgetCategoriesRepository.findOne({
      relations: { board: true, type: true },
      where: { board: category.board, name: category.name, type: category.type },
    })
    if (similarExistingCategory !== null) {
      throw new BadRequestException({
        fields: {
          boardId: `"${similarExistingCategory.name}" ${similarExistingCategory.type.name} category already exists in this board.`,
          name: `"${similarExistingCategory.name}" ${similarExistingCategory.type.name} category already exists in this board.`,
          typeId: `"${similarExistingCategory.name}" ${similarExistingCategory.type.name} category already exists in this board.`,
        },
      })
    }
    await this.budgetCategoriesRepository.save(category)
    return await this.find({ authorizedUser, categoryId })
  }

  async delete({
    authorizedUser,
    categoryId,
  }: {
    authorizedUser: UserEntity
    categoryId: BudgetCategoryEntity["id"]
  }): Promise<BudgetCategoryEntity> {
    const category = await this.find({ authorizedUser, categoryId })
    await this.budgetCategoriesRepository.delete(categoryId)
    return category
  }
}

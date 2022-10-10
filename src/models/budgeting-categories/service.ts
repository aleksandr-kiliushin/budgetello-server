import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { BoardsService } from "#models/boards/service"
import { BudgetingCategoryTypesService } from "#models/budgeting-category-types/service"
import { UserEntity } from "#models/user/entities/user.entity"

import { CreateBudgetingCategoryDto } from "./dto/create-budgeting-category.dto"
import { SearchbudgetingCategoriesQueryDto } from "./dto/seach-budgeting-categories-query.dto"
import { UpdateBudgetingCategoryDto } from "./dto/update-budgeting-category.dto"
import { BudgetingCategoryEntity } from "./entities/budgeting-category.entity"

@Injectable()
export class BudgetingCategoriesService {
  constructor(
    @InjectRepository(BudgetingCategoryEntity)
    private budgetingCategoriesRepository: Repository<BudgetingCategoryEntity>,
    private budgetingCategoryTypesService: BudgetingCategoryTypesService,
    private boardsService: BoardsService
  ) {}

  async search({
    authorizedUser,
    query,
  }: {
    authorizedUser: UserEntity
    query: SearchbudgetingCategoriesQueryDto
  }): Promise<BudgetingCategoryEntity[]> {
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

    return this.budgetingCategoriesRepository.find({
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
    categoryId: BudgetingCategoryEntity["id"]
  }): Promise<BudgetingCategoryEntity> {
    const category = await this.budgetingCategoriesRepository.findOne({
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
    requestBody: CreateBudgetingCategoryDto
  }): Promise<BudgetingCategoryEntity> {
    if (requestBody.name === undefined || requestBody.name === "")
      throw new BadRequestException({ fields: { name: "Required field." } })
    if (requestBody.typeId === undefined) {
      throw new BadRequestException({ fields: { typeId: "Required field." } })
    }
    if (requestBody.boardId === undefined) {
      throw new BadRequestException({ fields: { boardId: "Required field." } })
    }
    const type = await this.budgetingCategoryTypesService.find({ categoryTypeId: requestBody.typeId }).catch(() => {
      throw new BadRequestException({ fields: { typeId: "Invalid value." } })
    })
    const board = await this.boardsService.find({ boardId: requestBody.boardId }).catch(() => {
      throw new BadRequestException({ fields: { boardId: "Invalid value." } })
    })
    const similarExistingCategory = await this.budgetingCategoriesRepository.findOne({
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
    console.log("requestBody.name >>", requestBody.name)
    const category = this.budgetingCategoriesRepository.create({ board, name: requestBody.name, type })
    const createdCategory = await this.budgetingCategoriesRepository.save(category)
    return await this.find({ authorizedUser, categoryId: createdCategory.id })
  }

  async update({
    authorizedUser,
    categoryId,
    requestBody,
  }: {
    authorizedUser: UserEntity
    categoryId: BudgetingCategoryEntity["id"]
    requestBody: UpdateBudgetingCategoryDto
  }): Promise<BudgetingCategoryEntity> {
    const category = await this.find({ authorizedUser, categoryId })

    const isAuthorizedUserBoardAdmin = authorizedUser.administratedBoards.some((board) => {
      return board.id === category.board.id
    })
    const isAuthorizedUserBoardMember = authorizedUser.boards.some((board) => board.id === category.board.id)
    const canAuthorizedUserEditThisCategory = isAuthorizedUserBoardAdmin || isAuthorizedUserBoardMember
    if (!canAuthorizedUserEditThisCategory) {
      throw new ForbiddenException({ message: "Access denied." })
    }

    if (requestBody.boardId === undefined && requestBody.name === undefined && requestBody.typeId === undefined) {
      return category
    }
    if (requestBody.typeId !== undefined) {
      try {
        category.type = await this.budgetingCategoryTypesService.find({ categoryTypeId: requestBody.typeId })
      } catch {
        throw new BadRequestException({ fields: { typeId: "Invalid value." } })
      }
    }
    if (requestBody.boardId !== undefined) {
      try {
        category.board = await this.boardsService.find({ boardId: requestBody.boardId })
      } catch {
        throw new BadRequestException({ fields: { boardId: "Invalid value." } })
      }
    }
    if (requestBody.name !== undefined) {
      if (requestBody.name === "") {
        throw new BadRequestException({ fields: { name: "Category name cannot be empty." } })
      }
      category.name = requestBody.name
    }
    const similarExistingCategory = await this.budgetingCategoriesRepository.findOne({
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
    await this.budgetingCategoriesRepository.save(category)
    return await this.find({ authorizedUser, categoryId })
  }

  async delete({
    authorizedUser,
    categoryId,
  }: {
    authorizedUser: UserEntity
    categoryId: BudgetingCategoryEntity["id"]
  }): Promise<BudgetingCategoryEntity> {
    const category = await this.find({ authorizedUser, categoryId })
    await this.budgetingCategoriesRepository.delete(categoryId)
    return category
  }
}

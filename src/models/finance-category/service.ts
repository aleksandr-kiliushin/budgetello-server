import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { BoardEntity } from "#models/boards/entities/board.entity"
import { BoardsService } from "#models/boards/service"
import { FinanceCategoryTypeEntity } from "#models/finance-category-type/entities/finance-category-type.entity"
import { FinanceCategoryTypeService } from "#models/finance-category-type/service"
import { UserService } from "#models/user/service"

import { IUser } from "#interfaces/user"

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
    private boardsService: BoardsService,
    private userService: UserService
  ) {}

  async searchCategories({
    authorizedUserId,
    query,
  }: {
    authorizedUserId: IUser["id"]
    query: SearchFinanceCategoriesQueryDto
  }): Promise<FinanceCategoryEntity[]> {
    const authorizedUser = await this.userService.findUser({
      id: authorizedUserId,
      relations: { administratedBoards: true, boards: true },
    })

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
            .map(parseInt)
            .filter((boardIdFromQuery) => accessibleBoardsIds.includes(boardIdFromQuery))

    return this.financeCategoryRepository.find({
      order: { id: "ASC", name: "ASC" },
      relations: { board: true, type: true },
      where: {
        ...(query.boardId !== undefined && { board: In(query.boardId.split(",")) }),
        ...(query.id !== undefined && { id: In(query.id.split(",")) }),
        board: { id: In(boardsIdsToSearchWith) },
      },
    })
  }

  async findById({
    authorizedUserId,
    categoryId,
  }: {
    authorizedUserId: IUser["id"]
    categoryId: FinanceCategoryEntity["id"]
  }): Promise<FinanceCategoryEntity> {
    const category = await this.financeCategoryRepository.findOne({
      relations: { board: true, type: true },
      where: { id: categoryId },
    })
    if (category === null) throw new NotFoundException({})

    const authorizedUser = await this.userService.findUser({
      id: authorizedUserId,
      relations: { administratedBoards: true, boards: true },
    })
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
    authorizedUserId,
    createFinanceCategoryDto,
  }: {
    authorizedUserId: IUser["id"]
    createFinanceCategoryDto: CreateFinanceCategoryDto
  }): Promise<FinanceCategoryEntity> {
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
    return await this.findById({ authorizedUserId, categoryId: createdCategoryId })
  }

  async update({
    authorizedUserId,
    categoryId,
    updateFinanceCategoryDto,
  }: {
    authorizedUserId: IUser["id"]
    categoryId: FinanceCategoryEntity["id"]
    updateFinanceCategoryDto: UpdateFinanceCategoryDto
  }): Promise<FinanceCategoryEntity> {
    const { boardId, name, typeId } = updateFinanceCategoryDto
    const category = await this.findById({ authorizedUserId, categoryId })

    const authorizedUser = await this.userService.findUser({
      id: authorizedUserId,
      relations: { administratedBoards: true, boards: true },
    })
    const isAuthorizedUserBoardAdmin = authorizedUser.administratedBoards.some((board) => {
      return board.id === category.board.id
    })
    const isAuthorizedUserBoardMember = authorizedUser.boards.some((board) => board.id === category.board.id)
    const canAuthorizedUserEditThisCategory = isAuthorizedUserBoardAdmin || isAuthorizedUserBoardMember
    if (!canAuthorizedUserEditThisCategory) {
      throw new ForbiddenException({ message: "Access denied." })
    }

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
    return await this.findById({ authorizedUserId, categoryId })
  }

  async delete({
    authorizedUserId,
    categoryId,
  }: {
    authorizedUserId: IUser["id"]
    categoryId: FinanceCategoryEntity["id"]
  }): Promise<FinanceCategoryEntity> {
    const category = await this.findById({ authorizedUserId, categoryId })
    await this.financeCategoryRepository.delete(categoryId)
    return category
  }
}

import { ErrorMessage } from "#constants/ErrorMessage"
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { BoardsService } from "#models/boards/service"
import { BudgetCategoryTypesService } from "#models/budget-category-types/service"
import { UserEntity } from "#models/users/entities/user.entity"

import { CreateBudgetCategoryInput } from "./dto/create-budget-category.input"
import { SearchBudgetCategoriesArgs } from "./dto/search-budget-categories.args"
import { UpdateBudgetCategoryInput } from "./dto/update-budget-category.input"
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
    args,
    authorizedUser,
  }: {
    args: SearchBudgetCategoriesArgs
    authorizedUser: UserEntity
  }): Promise<BudgetCategoryEntity[]> {
    const accessibleBoardsIds = [
      ...new Set([
        ...authorizedUser.administratedBoards.map((board) => board.id),
        ...authorizedUser.participatedBoards.map((board) => board.id),
      ]),
    ]
    const boardsIdsToSearchWith =
      args.boardsIds === undefined
        ? accessibleBoardsIds
        : args.boardsIds.filter((boardIdFromQuery) => accessibleBoardsIds.includes(boardIdFromQuery))

    return this.budgetCategoriesRepository.find({
      order: {
        ...(args.orderingById !== undefined && { id: args.orderingById }),
        ...(args.orderingByType !== undefined && { type: { id: args.orderingByType } }),
      },
      relations: { board: true, type: true },
      where: {
        ...(args.ids !== undefined && { id: In(args.ids) }),
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
      relations: {
        board: { admins: true, members: true, subject: true },
        type: true,
      },
      where: { id: categoryId },
    })
    if (category === null) throw new NotFoundException({ message: "Not found." })

    const isAuthorizedUserBoardAdmin = authorizedUser.administratedBoards.some((board) => {
      return board.id === category.board.id
    })
    const isAuthorizedUserBoardMember = authorizedUser.participatedBoards.some((board) => {
      return board.id === category.board.id
    })
    const canAuthorizedUserFindThisBoard = isAuthorizedUserBoardAdmin || isAuthorizedUserBoardMember
    if (!canAuthorizedUserFindThisBoard) {
      throw new ForbiddenException({ message: ErrorMessage.ACCESS_DENIED })
    }

    return category
  }

  async create({
    authorizedUser,
    input,
  }: {
    authorizedUser: UserEntity
    input: CreateBudgetCategoryInput
  }): Promise<BudgetCategoryEntity> {
    const type = await this.budgetCategoryTypesService.find({ typeId: input.typeId }).catch(() => {
      throw new BadRequestException({ fields: { typeId: ErrorMessage.INVALID_VALUE } })
    })
    const board = await this.boardsService.find({ boardId: input.boardId }).catch(() => {
      throw new BadRequestException({ fields: { boardId: ErrorMessage.INVALID_VALUE } })
    })
    const similarExistingCategory = await this.budgetCategoriesRepository.findOne({
      relations: { board: true, type: true },
      where: {
        board: {
          id: board.id,
        },
        name: input.name,
        type,
      },
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
    const category = this.budgetCategoriesRepository.create({ board, name: input.name, type })
    const createdCategory = await this.budgetCategoriesRepository.save(category)
    return await this.find({ authorizedUser, categoryId: createdCategory.id })
  }

  async update({
    authorizedUser,
    input,
  }: {
    authorizedUser: UserEntity
    input: UpdateBudgetCategoryInput
  }): Promise<BudgetCategoryEntity> {
    const category = await this.find({ authorizedUser, categoryId: input.id })

    const isAuthorizedUserBoardAdmin = authorizedUser.administratedBoards.some((board) => {
      return board.id === category.board.id
    })
    const isAuthorizedUserBoardMember = authorizedUser.participatedBoards.some((board) => {
      return board.id === category.board.id
    })
    const canAuthorizedUserEditThisCategory = isAuthorizedUserBoardAdmin || isAuthorizedUserBoardMember
    if (!canAuthorizedUserEditThisCategory) {
      throw new ForbiddenException({ message: ErrorMessage.ACCESS_DENIED })
    }

    if (input.boardId === undefined && input.name === undefined && input.typeId === undefined) return category

    if (input.typeId !== undefined) {
      category.type = await this.budgetCategoryTypesService.find({ typeId: input.typeId }).catch(() => {
        throw new BadRequestException({ fields: { typeId: ErrorMessage.INVALID_VALUE } })
      })
    }
    if (input.boardId !== undefined) {
      category.board = await this.boardsService.find({ boardId: input.boardId }).catch(() => {
        throw new BadRequestException({ fields: { boardId: ErrorMessage.INVALID_VALUE } })
      })
    }
    if (input.name !== undefined) {
      if (input.name === "") {
        throw new BadRequestException({ fields: { name: ErrorMessage.REQUIRED } })
      }
      category.name = input.name
    }
    const similarExistingCategory = await this.budgetCategoriesRepository.findOne({
      relations: { board: true, type: true },
      where: {
        board: {
          id: category.board.id,
        },
        name: category.name,
        type: category.type,
      },
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
    return await this.find({ authorizedUser, categoryId: input.id })
  }

  async delete({
    authorizedUser,
    categoryId,
  }: {
    authorizedUser: UserEntity
    categoryId: BudgetCategoryEntity["id"]
  }): Promise<BudgetCategoryEntity> {
    const category = await this.find({ authorizedUser, categoryId })
    if (category.board.admins.every((admin) => admin.id !== authorizedUser.id)) {
      throw new ForbiddenException({ message: ErrorMessage.ACCESS_DENIED })
    }
    await this.budgetCategoriesRepository.delete(categoryId)
    return category
  }
}

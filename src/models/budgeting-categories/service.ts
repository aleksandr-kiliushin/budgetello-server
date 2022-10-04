import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { BoardsService } from "#models/boards/service"
import { BudgetingCategoryTypeService } from "#models/budgeting-category-types/service"
import { UserEntity } from "#models/user/entities/user.entity"

import { CreateBudgetingCategoryDto } from "./dto/create-budgeting-category.dto"
import { SearchbudgetingCategoriesQueryDto } from "./dto/seach-budgeting-categories-query.dto"
import { UpdateBudgetingCategoryDto } from "./dto/update-budgeting-category.dto"
import { BudgetingCategoryEntity } from "./entities/budgeting-category.entity"

@Injectable()
export class BudgetingCategoryService {
  constructor(
    @InjectRepository(BudgetingCategoryEntity)
    private budgetingCategoryRepository: Repository<BudgetingCategoryEntity>,
    private budgetingCategoryTypeservice: BudgetingCategoryTypeService,
    private boardsService: BoardsService
  ) {}

  async searchCategories({
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
            .map(parseInt)
            .filter((boardIdFromQuery) => accessibleBoardsIds.includes(boardIdFromQuery))

    return this.budgetingCategoryRepository.find({
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
    authorizedUser,
    categoryId,
  }: {
    authorizedUser: UserEntity
    categoryId: BudgetingCategoryEntity["id"]
  }): Promise<BudgetingCategoryEntity> {
    const category = await this.budgetingCategoryRepository.findOne({
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
    CreateBudgetingCategoryDto,
  }: {
    authorizedUser: UserEntity
    CreateBudgetingCategoryDto: CreateBudgetingCategoryDto
  }): Promise<BudgetingCategoryEntity> {
    if (CreateBudgetingCategoryDto.name === undefined || CreateBudgetingCategoryDto.name === "")
      throw new BadRequestException({ fields: { name: "Required field." } })
    if (CreateBudgetingCategoryDto.typeId === undefined) {
      throw new BadRequestException({ fields: { typeId: "Required field." } })
    }
    if (CreateBudgetingCategoryDto.boardId === undefined) {
      throw new BadRequestException({ fields: { boardId: "Required field." } })
    }
    const type = await this.budgetingCategoryTypeservice
      .find({ budgetingCategoryTypeId: CreateBudgetingCategoryDto.typeId })
      .catch(() => {
        throw new BadRequestException({ fields: { typeId: "Invalid category type." } })
      })
    const board = await this.boardsService.find({ boardId: CreateBudgetingCategoryDto.boardId }).catch(() => {
      throw new BadRequestException({ fields: { boardId: "Invalid board." } })
    })
    const theSameExistingCategory = await this.budgetingCategoryRepository.findOne({
      relations: { board: true, type: true },
      where: { board, name: CreateBudgetingCategoryDto.name, type },
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
    const category = this.budgetingCategoryRepository.create({ board, name: CreateBudgetingCategoryDto.name, type })
    const createdCategory = await this.budgetingCategoryRepository.save(category)
    return await this.findById({ authorizedUser, categoryId: createdCategory.id })
  }

  async update({
    authorizedUser,
    categoryId,
    UpdateBudgetingCategoryDto,
  }: {
    authorizedUser: UserEntity
    categoryId: BudgetingCategoryEntity["id"]
    UpdateBudgetingCategoryDto: UpdateBudgetingCategoryDto
  }): Promise<BudgetingCategoryEntity> {
    const category = await this.findById({ authorizedUser, categoryId })

    const isAuthorizedUserBoardAdmin = authorizedUser.administratedBoards.some((board) => {
      return board.id === category.board.id
    })
    const isAuthorizedUserBoardMember = authorizedUser.boards.some((board) => board.id === category.board.id)
    const canAuthorizedUserEditThisCategory = isAuthorizedUserBoardAdmin || isAuthorizedUserBoardMember
    if (!canAuthorizedUserEditThisCategory) {
      throw new ForbiddenException({ message: "Access denied." })
    }

    if (
      UpdateBudgetingCategoryDto.boardId === undefined &&
      UpdateBudgetingCategoryDto.name === undefined &&
      UpdateBudgetingCategoryDto.typeId === undefined
    ) {
      return category
    }
    if (UpdateBudgetingCategoryDto.typeId !== undefined) {
      try {
        category.type = await this.budgetingCategoryTypeservice.find({
          budgetingCategoryTypeId: UpdateBudgetingCategoryDto.typeId,
        })
      } catch {
        throw new BadRequestException({ fields: { typeId: "Invalid category type." } })
      }
    }
    if (UpdateBudgetingCategoryDto.boardId !== undefined) {
      try {
        category.board = await this.boardsService.find({ boardId: UpdateBudgetingCategoryDto.boardId })
      } catch {
        throw new BadRequestException({ fields: { boardId: "Invalid board." } })
      }
    }
    if (UpdateBudgetingCategoryDto.name !== undefined) {
      if (UpdateBudgetingCategoryDto.name === "") {
        throw new BadRequestException({ fields: { name: "Category name cannot be empty." } })
      }
      category.name = UpdateBudgetingCategoryDto.name
    }
    const theSameExistingCategory = await this.budgetingCategoryRepository.findOne({
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
    await this.budgetingCategoryRepository.save(category)
    return await this.findById({ authorizedUser, categoryId })
  }

  async delete({
    authorizedUser,
    categoryId,
  }: {
    authorizedUser: UserEntity
    categoryId: BudgetingCategoryEntity["id"]
  }): Promise<BudgetingCategoryEntity> {
    const category = await this.findById({ authorizedUser, categoryId })
    await this.budgetingCategoryRepository.delete(categoryId)
    return category
  }
}

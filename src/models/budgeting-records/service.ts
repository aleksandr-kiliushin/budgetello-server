import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { BudgetingCategoryEntity } from "#models/budgeting-categories/entities/budgeting-category.entity"
import { BudgetingCategoryService } from "#models/budgeting-categories/service"
import { UserEntity } from "#models/user/entities/user.entity"

import { CreateBudgetingRecordDto } from "./dto/create-budgeting-record.dto"
import { SearchBudgetingRecordsQueryDto } from "./dto/search-budgeting-records-query.dto"
import { UpdateBudgetingRecordDto } from "./dto/update-budgeting-record.dto"
import { BudgetingRecordEntity } from "./entities/budgeting-record.entity"

@Injectable()
export class budgetingRecordservice {
  constructor(
    @InjectRepository(BudgetingRecordEntity)
    private budgetingRecordRepository: Repository<BudgetingRecordEntity>,
    private BudgetingCategoryService: BudgetingCategoryService
  ) {}

  async search({
    authorizedUser,
    query,
  }: {
    authorizedUser: UserEntity
    query: SearchBudgetingRecordsQueryDto
  }): Promise<BudgetingRecordEntity[]> {
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

    const accessibleCategoriesOfSelectedBoards = await this.BudgetingCategoryService.searchCategories({
      authorizedUser,
      query: { boardId: boardsIdsToSearchWith.join(",") },
    })
    const accessibleCategoriesOfSelectedBoardsIds = accessibleCategoriesOfSelectedBoards.map((category) => category.id)
    const categoriesIdsToSearchWith =
      query.categoryId === undefined
        ? accessibleCategoriesOfSelectedBoardsIds
        : query.categoryId
            .split(",")
            .map(parseInt)
            .filter((categoryIdFromQuery) => accessibleCategoriesOfSelectedBoardsIds.includes(categoryIdFromQuery))

    return this.budgetingRecordRepository.find({
      order: {
        id: query.orderingById ?? "desc",
        date: query.orderingById ?? "desc",
      },
      relations: { category: { board: true, type: true } },
      skip: query.skip === undefined ? 0 : parseInt(query.skip),
      ...(query.take !== undefined && { take: parseInt(query.take) }),
      where: {
        ...(query.amount !== undefined && { amount: In(query.amount.split(",")) }),
        ...(query.date !== undefined && { date: In(query.date.split(",")) }),
        ...(query.id !== undefined && { id: In(query.id.split(",")) }),
        ...(query.isTrashed === "true" && { isTrashed: true }),
        ...(query.isTrashed === "false" && { isTrashed: false }),
        category: { id: In(categoriesIdsToSearchWith) },
      },
    })
  }

  async find({
    authorizedUser,
    recordId,
  }: {
    authorizedUser: UserEntity
    recordId: BudgetingRecordEntity["id"]
  }): Promise<BudgetingRecordEntity> {
    const record = await this.budgetingRecordRepository.findOne({
      relations: { category: { board: true, type: true } },
      where: { id: recordId },
    })
    if (record === null) {
      throw new NotFoundException({ message: `Record with ID '${recordId}' not found.` })
    }

    const accessibleBoardsIds = [
      ...new Set([
        ...authorizedUser.administratedBoards.map((board) => board.id),
        ...authorizedUser.boards.map((board) => board.id),
      ]),
    ]
    if (!accessibleBoardsIds.includes(record.category.board.id)) {
      throw new ForbiddenException({ message: "Access denied." })
    }

    return record
  }

  async create({
    authorizedUser,
    createBudgetingRecordDto,
  }: {
    authorizedUser: UserEntity
    createBudgetingRecordDto: CreateBudgetingRecordDto
  }): Promise<BudgetingRecordEntity> {
    if (typeof createBudgetingRecordDto.amount !== "number" || createBudgetingRecordDto.amount <= 0) {
      throw new BadRequestException({ fields: { amount: "Should be a positive number." } })
    }
    if (createBudgetingRecordDto.categoryId === undefined) {
      throw new BadRequestException({ fields: { categoryId: "Required field." } })
    }
    let category: BudgetingCategoryEntity | undefined
    try {
      category = await this.BudgetingCategoryService.findById({
        authorizedUser,
        categoryId: createBudgetingRecordDto.categoryId,
      })
    } catch {
      throw new BadRequestException({ fields: { categoryId: "Invalid category." } })
    }
    if (createBudgetingRecordDto.date === undefined) {
      throw new BadRequestException({ fields: { date: "Required field." } })
    }
    if (!/\d\d\d\d-\d\d-\d\d/.test(createBudgetingRecordDto.date)) {
      throw new BadRequestException({ fields: { date: "Should have format YYYY-MM-DD." } })
    }
    const record = this.budgetingRecordRepository.create(createBudgetingRecordDto)
    record.category = category
    return this.budgetingRecordRepository.save(record)
  }

  async update({
    authorizedUser,
    recordId,
    updateBudgetingRecordDto,
  }: {
    authorizedUser: UserEntity
    recordId: BudgetingRecordEntity["id"]
    updateBudgetingRecordDto: UpdateBudgetingRecordDto
  }): Promise<BudgetingRecordEntity> {
    const record = await this.find({ authorizedUser, recordId })
    if (updateBudgetingRecordDto.amount !== undefined) {
      if (typeof updateBudgetingRecordDto.amount !== "number" || updateBudgetingRecordDto.amount <= 0) {
        throw new BadRequestException({ fields: { amount: "Should be a positive number." } })
      }
      record.amount = updateBudgetingRecordDto.amount
    }
    if (typeof updateBudgetingRecordDto.isTrashed === "boolean") {
      record.isTrashed = updateBudgetingRecordDto.isTrashed
    }
    if (updateBudgetingRecordDto.date !== undefined) {
      if (!/\d\d\d\d-\d\d-\d\d/.test(updateBudgetingRecordDto.date)) {
        throw new BadRequestException({ fields: { date: "Should have format YYYY-MM-DD." } })
      }
      record.date = updateBudgetingRecordDto.date
    }
    if (updateBudgetingRecordDto.categoryId !== undefined) {
      try {
        record.category = await this.BudgetingCategoryService.findById({
          authorizedUser,
          categoryId: updateBudgetingRecordDto.categoryId,
        })
      } catch {
        throw new BadRequestException({ fields: { categoryId: "Invalid category." } })
      }
    }
    return this.budgetingRecordRepository.save(record)
  }

  async delete({
    authorizedUser,
    recordId,
  }: {
    authorizedUser: UserEntity
    recordId: BudgetingRecordEntity["id"]
  }): Promise<BudgetingRecordEntity> {
    const record = await this.find({ authorizedUser, recordId })
    await this.budgetingRecordRepository.delete(recordId)
    return record
  }
}

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { BudgetCategoriesService } from "#models/budget-categories/service"
import { UserEntity } from "#models/user/entities/user.entity"

import { CreateBudgetRecordDto } from "./dto/create-budget-record.dto"
import { SearchBudgetRecordsQueryDto } from "./dto/search-budget-records-query.dto"
import { UpdateBudgetRecordDto } from "./dto/update-budget-record.dto"
import { BudgetRecordEntity } from "./entities/budget-record.entity"

@Injectable()
export class BudgetRecordsService {
  constructor(
    @InjectRepository(BudgetRecordEntity)
    private budgetRecordsRepository: Repository<BudgetRecordEntity>,
    private budgetCategoriesService: BudgetCategoriesService
  ) {}

  async search({
    authorizedUser,
    query,
  }: {
    authorizedUser: UserEntity
    query: SearchBudgetRecordsQueryDto
  }): Promise<BudgetRecordEntity[]> {
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

    const accessibleCategoriesOfSelectedBoards = await this.budgetCategoriesService.search({
      authorizedUser,
      query: { boardId: boardsIdsToSearchWith.join(",") },
    })
    const accessibleCategoriesOfSelectedBoardsIds = accessibleCategoriesOfSelectedBoards.map((category) => category.id)
    const categoriesIdsToSearchWith =
      query.categoryId === undefined
        ? accessibleCategoriesOfSelectedBoardsIds
        : query.categoryId
            .split(",")
            .map((boardId) => parseInt(boardId))
            .filter((categoryIdFromQuery) => accessibleCategoriesOfSelectedBoardsIds.includes(categoryIdFromQuery))

    return this.budgetRecordsRepository.find({
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
    recordId: BudgetRecordEntity["id"]
  }): Promise<BudgetRecordEntity> {
    const record = await this.budgetRecordsRepository.findOne({
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
    requestBody,
  }: {
    authorizedUser: UserEntity
    requestBody: CreateBudgetRecordDto
  }): Promise<BudgetRecordEntity> {
    if (typeof requestBody.amount !== "number" || requestBody.amount <= 0) {
      throw new BadRequestException({ fields: { amount: "Should be a positive number." } })
    }
    if (requestBody.date === undefined) {
      throw new BadRequestException({ fields: { date: "Required field." } })
    }
    if (requestBody.categoryId === undefined) {
      throw new BadRequestException({ fields: { categoryId: "Required field." } })
    }
    const category = await this.budgetCategoriesService
      .find({ authorizedUser, categoryId: requestBody.categoryId })
      .catch(() => {
        throw new BadRequestException({ fields: { categoryId: "Invalid category." } })
      })
    if (!/\d\d\d\d-\d\d-\d\d/.test(requestBody.date)) {
      throw new BadRequestException({ fields: { date: "Should have format YYYY-MM-DD." } })
    }
    const record = this.budgetRecordsRepository.create(requestBody)
    record.category = category
    return this.budgetRecordsRepository.save(record)
  }

  async update({
    authorizedUser,
    recordId,
    requestBody,
  }: {
    authorizedUser: UserEntity
    recordId: BudgetRecordEntity["id"]
    requestBody: UpdateBudgetRecordDto
  }): Promise<BudgetRecordEntity> {
    const record = await this.find({ authorizedUser, recordId })
    if (requestBody.amount !== undefined) {
      if (typeof requestBody.amount !== "number" || requestBody.amount <= 0) {
        throw new BadRequestException({ fields: { amount: "Should be a positive number." } })
      }
      record.amount = requestBody.amount
    }
    if (typeof requestBody.isTrashed === "boolean") {
      record.isTrashed = requestBody.isTrashed
    }
    if (requestBody.date !== undefined) {
      if (!/\d\d\d\d-\d\d-\d\d/.test(requestBody.date)) {
        throw new BadRequestException({ fields: { date: "Should have format YYYY-MM-DD." } })
      }
      record.date = requestBody.date
    }
    if (requestBody.categoryId !== undefined) {
      try {
        record.category = await this.budgetCategoriesService.find({
          authorizedUser,
          categoryId: requestBody.categoryId,
        })
      } catch {
        throw new BadRequestException({ fields: { categoryId: "Invalid category." } })
      }
    }
    return this.budgetRecordsRepository.save(record)
  }

  async delete({
    authorizedUser,
    recordId,
  }: {
    authorizedUser: UserEntity
    recordId: BudgetRecordEntity["id"]
  }): Promise<BudgetRecordEntity> {
    const record = await this.find({ authorizedUser, recordId })
    await this.budgetRecordsRepository.delete(recordId)
    return record
  }
}

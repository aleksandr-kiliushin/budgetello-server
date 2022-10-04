import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { FinanceCategoryEntity } from "#models/finance-category/entities/finance-category.entity"
import { FinanceCategoryService } from "#models/finance-category/service"
import { UserEntity } from "#models/user/entities/user.entity"

import { CreateFinanceRecordDto } from "./dto/create-finance-record.dto"
import { SearchFinanceRecordsQueryDto } from "./dto/search-finance-records-query.dto"
import { UpdateFinanceRecordDto } from "./dto/update-finance-record.dto"
import { FinanceRecordEntity } from "./entities/finance-record.entity"

@Injectable()
export class FinanceRecordService {
  constructor(
    @InjectRepository(FinanceRecordEntity)
    private financeRecordRepository: Repository<FinanceRecordEntity>,
    private financeCategoryService: FinanceCategoryService
  ) {}

  async search({
    authorizedUser,
    query,
  }: {
    authorizedUser: UserEntity
    query: SearchFinanceRecordsQueryDto
  }): Promise<FinanceRecordEntity[]> {
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

    const accessibleCategoriesOfSelectedBoards = await this.financeCategoryService.searchCategories({
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

    return this.financeRecordRepository.find({
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

  async findById({
    authorizedUser,
    recordId,
  }: {
    authorizedUser: UserEntity
    recordId: FinanceRecordEntity["id"]
  }): Promise<FinanceRecordEntity> {
    const record = await this.financeRecordRepository.findOne({
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
    createFinanceRecordDto,
  }: {
    authorizedUser: UserEntity
    createFinanceRecordDto: CreateFinanceRecordDto
  }): Promise<FinanceRecordEntity> {
    if (typeof createFinanceRecordDto.amount !== "number" || createFinanceRecordDto.amount <= 0) {
      throw new BadRequestException({ fields: { amount: "Should be a positive number." } })
    }
    if (createFinanceRecordDto.categoryId === undefined) {
      throw new BadRequestException({ fields: { categoryId: "Required field." } })
    }
    let category: FinanceCategoryEntity | undefined
    try {
      category = await this.financeCategoryService.findById({
        authorizedUser,
        categoryId: createFinanceRecordDto.categoryId,
      })
    } catch {
      throw new BadRequestException({ fields: { categoryId: "Invalid category." } })
    }
    if (createFinanceRecordDto.date === undefined) {
      throw new BadRequestException({ fields: { date: "Required field." } })
    }
    if (!/\d\d\d\d-\d\d-\d\d/.test(createFinanceRecordDto.date)) {
      throw new BadRequestException({ fields: { date: "Should have format YYYY-MM-DD." } })
    }
    const record = this.financeRecordRepository.create(createFinanceRecordDto)
    record.category = category
    return this.financeRecordRepository.save(record)
  }

  async updateFinanceRecord({
    authorizedUser,
    recordId,
    updateFinanceRecordDto,
  }: {
    authorizedUser: UserEntity
    recordId: FinanceRecordEntity["id"]
    updateFinanceRecordDto: UpdateFinanceRecordDto
  }): Promise<FinanceRecordEntity> {
    const record = await this.findById({ authorizedUser, recordId })
    if (updateFinanceRecordDto.amount !== undefined) {
      if (typeof updateFinanceRecordDto.amount !== "number" || updateFinanceRecordDto.amount <= 0) {
        throw new BadRequestException({ fields: { amount: "Should be a positive number." } })
      }
      record.amount = updateFinanceRecordDto.amount
    }
    if (typeof updateFinanceRecordDto.isTrashed === "boolean") {
      record.isTrashed = updateFinanceRecordDto.isTrashed
    }
    if (updateFinanceRecordDto.date !== undefined) {
      if (!/\d\d\d\d-\d\d-\d\d/.test(updateFinanceRecordDto.date)) {
        throw new BadRequestException({ fields: { date: "Should have format YYYY-MM-DD." } })
      }
      record.date = updateFinanceRecordDto.date
    }
    if (updateFinanceRecordDto.categoryId !== undefined) {
      try {
        record.category = await this.financeCategoryService.findById({
          authorizedUser,
          categoryId: updateFinanceRecordDto.categoryId,
        })
      } catch {
        throw new BadRequestException({ fields: { categoryId: "Invalid category." } })
      }
    }
    return this.financeRecordRepository.save(record)
  }

  async deleteFinanceRecord({
    authorizedUser,
    recordId,
  }: {
    authorizedUser: UserEntity
    recordId: FinanceRecordEntity["id"]
  }): Promise<FinanceRecordEntity> {
    const record = await this.findById({ authorizedUser, recordId })
    await this.financeRecordRepository.delete(recordId)
    return record
  }
}

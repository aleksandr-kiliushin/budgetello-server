import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Equal, In, Repository } from "typeorm"

import { BudgetCategoriesService } from "#models/budget-categories/service"
import { UserEntity } from "#models/users/entities/user.entity"

import { CreateBudgetRecordDto } from "./dto/create-budget-record.dto"
import { SearchBudgetRecordsArgs } from "./dto/search-budget-records.args"
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
    args,
    authorizedUser,
  }: {
    args: SearchBudgetRecordsArgs
    authorizedUser: UserEntity
  }): Promise<BudgetRecordEntity[]> {
    const accessibleBoardsIds = [
      ...new Set([
        ...authorizedUser.administratedBoards.map((board) => board.id),
        ...authorizedUser.boards.map((board) => board.id),
      ]),
    ]

    const boardsIdsToSearchWith =
      args.boardsIds === undefined
        ? accessibleBoardsIds
        : args.boardsIds.filter((boardIdFromQuery) => accessibleBoardsIds.includes(boardIdFromQuery))

    const accessibleCategoriesOfSelectedBoards = await this.budgetCategoriesService.search({
      args: { boardsIds: boardsIdsToSearchWith },
      authorizedUser,
    })
    const accessibleCategoriesOfSelectedBoardsIds = accessibleCategoriesOfSelectedBoards.map((category) => category.id)
    const categoriesIdsToSearchWith =
      args.categoriesIds === undefined
        ? accessibleCategoriesOfSelectedBoardsIds
        : args.categoriesIds.filter((categoryIdFromQuery) => {
            return accessibleCategoriesOfSelectedBoardsIds.includes(categoryIdFromQuery)
          })

    return this.budgetRecordsRepository.find({
      order: {
        id: args.orderingById ?? "desc",
        date: args.orderingById ?? "desc",
      },
      relations: { category: { board: true, type: true } },
      skip: args.skip === undefined ? 0 : args.skip,
      ...(args.take !== undefined && { take: args.take }),
      where: {
        ...(args.amount !== undefined && { amount: Equal(args.amount) }), // TODO: Test it.
        ...(args.dates !== undefined && { date: In(args.dates) }),
        ...(args.ids !== undefined && { id: In(args.ids) }),
        ...(args.isTrashed !== undefined && { isTrashed: args.isTrashed }),
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
      throw new NotFoundException({ message: "Not found." })
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
    const category = await this.budgetCategoriesService
      .find({ authorizedUser, categoryId: requestBody.categoryId })
      .catch(() => {
        throw new BadRequestException({ fields: { categoryId: "Invalid category." } })
      })
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
      record.category = await this.budgetCategoriesService
        .find({ authorizedUser, categoryId: requestBody.categoryId })
        .catch(() => {
          throw new BadRequestException({ fields: { categoryId: "Invalid category." } })
        })
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

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Equal, In, Repository } from "typeorm"

import { BudgetCategoriesService } from "#models/budget-categories/service"
import { UserEntity } from "#models/users/entities/user.entity"

import { CreateBudgetRecordInput } from "./dto/create-budget-record.input"
import { SearchBudgetRecordsArgs } from "./dto/search-budget-records.args"
import { UpdateBudgetRecordInput } from "./dto/update-budget-record.input"
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
        id: args.orderingById ?? "ASC",
        date: args.orderingById ?? "ASC",
      },
      relations: {
        category: {
          board: { admins: true, members: true, subject: true },
          type: true,
        },
      },
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
    input,
  }: {
    authorizedUser: UserEntity
    input: CreateBudgetRecordInput
  }): Promise<BudgetRecordEntity> {
    const category = await this.budgetCategoriesService
      .find({ authorizedUser, categoryId: input.categoryId })
      .catch(() => {
        throw new BadRequestException({ fields: { categoryId: "Invalid value." } })
      })
    const record = this.budgetRecordsRepository.create(input)
    record.category = category
    return this.budgetRecordsRepository.save(record)
  }

  async update({
    authorizedUser,
    input,
  }: {
    authorizedUser: UserEntity
    input: UpdateBudgetRecordInput
  }): Promise<BudgetRecordEntity> {
    const record = await this.find({ authorizedUser, recordId: input.id })
    if (input.amount !== undefined) {
      record.amount = input.amount
    }
    if (typeof input.isTrashed === "boolean") {
      record.isTrashed = input.isTrashed
    }
    if (input.date !== undefined) {
      record.date = input.date
    }
    if (input.categoryId !== undefined) {
      record.category = await this.budgetCategoriesService
        .find({ authorizedUser, categoryId: input.categoryId })
        .catch(() => {
          throw new BadRequestException({ fields: { categoryId: "Invalid value." } })
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

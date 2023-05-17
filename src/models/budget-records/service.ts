import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Equal, In, Repository } from "typeorm"

import { BudgetCategoriesService } from "#models/budget-categories/service"
import { CurrenciesService } from "#models/currencies/service"
import { UserEntity } from "#models/users/entities/user.entity"

import { GqlError } from "#helpers/GqlError"

import { ErrorMessage, GqlErrorCode } from "#constants"

import { CreateBudgetRecordInput } from "./dto/create-budget-record.input"
import { SearchBudgetRecordsArgs } from "./dto/search-budget-records.args"
import { UpdateBudgetRecordInput } from "./dto/update-budget-record.input"
import { BudgetRecordEntity } from "./entities/budget-record.entity"

@Injectable()
export class BudgetRecordsService {
  constructor(
    @InjectRepository(BudgetRecordEntity)
    private budgetRecordsRepository: Repository<BudgetRecordEntity>,
    private budgetCategoriesService: BudgetCategoriesService,
    private currenciesService: CurrenciesService
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
        ...authorizedUser.participatedBoards.map((board) => board.id),
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
        ...(args.orderingByDate !== undefined && { date: args.orderingByDate }),
        ...(args.orderingById !== undefined && { id: args.orderingById }),
      },
      relations: {
        author: true,
        category: { board: true, type: true },
        currency: true,
      },
      skip: args.skip === undefined ? 0 : args.skip,
      ...(args.take !== undefined && { take: args.take }),
      where: {
        ...(args.amount !== undefined && { amount: Equal(args.amount) }),
        ...(args.dates !== undefined && { date: In(args.dates) }),
        ...(args.ids !== undefined && { id: In(args.ids) }),
        ...(args.isTrashed !== undefined && { isTrashed: args.isTrashed }),
        ...(args.currenciesSlugs !== undefined && {
          currency: { slug: In(args.currenciesSlugs) },
        }),
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
      relations: {
        author: true,
        category: { board: true, type: true },
        currency: true,
      },
      where: { id: recordId },
    })
    if (record === null) {
      throw new GqlError(GqlErrorCode.BAD_REQUEST, { message: "Not found." })
    }

    const accessibleBoardsIds = [
      ...new Set([
        ...authorizedUser.administratedBoards.map((board) => board.id),
        ...authorizedUser.participatedBoards.map((board) => board.id),
      ]),
    ]
    if (!accessibleBoardsIds.includes(record.category.board.id)) {
      throw new GqlError(GqlErrorCode.FORBIDDEN, { message: ErrorMessage.ACCESS_DENIED })
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
    const record = this.budgetRecordsRepository.create({
      amount: input.amount,
      comment: input.comment,
      author: authorizedUser,
      date: input.date,
      isTrashed: false,
    })
    record.category = await this.budgetCategoriesService
      .find({ authorizedUser, categoryId: input.categoryId })
      .catch(() => {
        throw new GqlError(GqlErrorCode.BAD_REQUEST, { fields: { categoryId: ErrorMessage.INVALID_VALUE } })
      })
    record.currency = await this.currenciesService.find({ currencySlug: input.currencySlug }).catch(() => {
      throw new GqlError(GqlErrorCode.BAD_REQUEST, { fields: { currencySlug: ErrorMessage.INVALID_VALUE } })
    })
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
    if (input.comment !== undefined) {
      record.comment = input.comment
    }
    if (input.isTrashed !== undefined) {
      record.isTrashed = input.isTrashed
    }
    if (input.date !== undefined) {
      record.date = input.date
    }
    if (input.categoryId !== undefined) {
      record.category = await this.budgetCategoriesService
        .find({ authorizedUser, categoryId: input.categoryId })
        .catch(() => {
          throw new GqlError(GqlErrorCode.BAD_REQUEST, { fields: { categoryId: ErrorMessage.INVALID_VALUE } })
        })
    }
    if (input.currencySlug !== undefined) {
      record.currency = await this.currenciesService.find({ currencySlug: input.currencySlug }).catch(() => {
        throw new GqlError(GqlErrorCode.BAD_REQUEST, { fields: { currencySlug: ErrorMessage.INVALID_VALUE } })
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

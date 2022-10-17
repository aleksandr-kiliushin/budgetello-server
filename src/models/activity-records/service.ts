import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { ActivityCategoriesService } from "#models/activity-categories/service"
import { UserEntity } from "#models/users/entities/user.entity"

import { CreateActivityRecordDto } from "./dto/create-activity-record.dto"
import { SearchActivityRecordsArgs } from "./dto/search-budget-records.args"
import { UpdateActivityRecordDto } from "./dto/update-activity-record.dto"
import { ActivityRecordEntity } from "./entities/activity-record.entity"

@Injectable()
export class ActivityRecordsService {
  constructor(
    @InjectRepository(ActivityRecordEntity)
    private activityRecordsRepository: Repository<ActivityRecordEntity>,
    private activityCategoriesService: ActivityCategoriesService
  ) {}

  async search({
    args,
    authorizedUser,
  }: {
    args: SearchActivityRecordsArgs
    authorizedUser: UserEntity
  }): Promise<ActivityRecordEntity[]> {
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

    const accessibleCategoriesOfSelectedBoards = await this.activityCategoriesService.search({
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

    return this.activityRecordsRepository.find({
      order: {
        id: args.orderingById ?? "desc",
        date: args.orderingById ?? "desc",
      },
      relations: { category: { board: true, owner: true, measurementType: true } },
      skip: args.skip === undefined ? 0 : args.skip,
      ...(args.take !== undefined && { take: args.take }),
      where: {
        ...(args.dates !== undefined && { date: In(args.dates) }),
        ...(args.ids !== undefined && { id: In(args.ids) }),
        category: { id: In(categoriesIdsToSearchWith) },
      },
    })
  }

  async find({
    authorizedUser,
    recordId,
  }: {
    authorizedUser: UserEntity
    recordId: ActivityRecordEntity["id"]
  }): Promise<ActivityRecordEntity> {
    const record = await this.activityRecordsRepository.findOne({
      relations: { category: { board: true, owner: true, measurementType: true } },
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
    requestBody: CreateActivityRecordDto
  }): Promise<ActivityRecordEntity> {
    const category = await this.activityCategoriesService
      .find({ authorizedUser, categoryId: requestBody.categoryId })
      .catch(() => {
        throw new BadRequestException({ fields: { categoryId: "Invalid category." } })
      })
    if (category.owner.id !== authorizedUser.id) {
      throw new ForbiddenException({ message: "Access denied." })
    }
    if (category.measurementType.id === 1 && typeof requestBody.quantitativeValue !== "number") {
      throw new BadRequestException({
        fields: {
          categoryId: "Amount should be filled for «Quantitative» activity.",
          quantitativeValue: "Amount should be filled for «Quantitative» activity.",
        },
      })
    }
    if (category.measurementType.id === 2 && typeof requestBody.booleanValue !== "boolean") {
      throw new BadRequestException({
        fields: {
          categoryId: "Yes-no option should be filled for «Yes / no» activity.",
          booleanValue: "Yes-no option should be filled for «Yes / no» activity.",
        },
      })
    }
    const record = this.activityRecordsRepository.create(requestBody)
    record.category = category
    const createdRecord = await this.activityRecordsRepository.save(record)
    return await this.find({ authorizedUser, recordId: createdRecord.id })
  }

  async update({
    authorizedUser,
    recordId,
    requestBody,
  }: {
    authorizedUser: UserEntity
    recordId: ActivityRecordEntity["id"]
    requestBody: UpdateActivityRecordDto
  }): Promise<ActivityRecordEntity> {
    const record = await this.find({ authorizedUser, recordId })
    if (record.category.owner.id !== authorizedUser.id) {
      throw new ForbiddenException({ message: "Access denied." })
    }
    if (Object.keys(requestBody).length === 0) return record
    if (requestBody.booleanValue !== undefined) {
      record.booleanValue = requestBody.booleanValue
    }
    if (requestBody.quantitativeValue !== undefined) {
      record.quantitativeValue = requestBody.quantitativeValue
    }
    if (requestBody.comment !== undefined) {
      if (typeof requestBody.comment !== "string") {
        throw new BadRequestException({ fields: { comment: "Must be a string." } })
      }
      record.comment = requestBody.comment
    }
    if (requestBody.date !== undefined) {
      if (!/\d\d\d\d-\d\d-\d\d/.test(requestBody.date)) {
        throw new BadRequestException({ fields: { date: "Should have format YYYY-MM-DD." } })
      }
      record.date = requestBody.date
    }
    if (requestBody.categoryId !== undefined) {
      record.category = await this.activityCategoriesService
        .find({ authorizedUser, categoryId: requestBody.categoryId })
        .catch(() => {
          throw new BadRequestException({ fields: { categoryId: "Invalid value." } })
        })
    }
    if (record.category.measurementType.id === 1 && typeof record.quantitativeValue !== "number") {
      throw new BadRequestException({
        fields: {
          categoryId: "Amount should be filled for «Quantitative» activity.",
          quantitativeValue: "Amount should be filled for «Quantitative» activity.",
        },
      })
    }
    if (record.category.measurementType.id === 2 && typeof record.booleanValue !== "boolean") {
      throw new BadRequestException({
        fields: {
          categoryId: "Yes-no option should be filled for «Yes / no» activity.",
          booleanValue: "Yes-no option should be filled for «Yes / no» activity.",
        },
      })
    }
    return this.activityRecordsRepository.save(record)
  }

  async delete({
    authorizedUser,
    recordId,
  }: {
    authorizedUser: UserEntity
    recordId: ActivityRecordEntity["id"]
  }): Promise<ActivityRecordEntity> {
    const record = await this.find({ authorizedUser, recordId })
    if (record.category.owner.id !== authorizedUser.id) {
      throw new ForbiddenException({ message: "Access denied." })
    }
    await this.activityRecordsRepository.delete(recordId)
    return record
  }
}

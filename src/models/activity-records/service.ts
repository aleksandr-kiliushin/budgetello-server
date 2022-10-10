import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { ActivityCategoriesService } from "#models/activity-categories/service"
import { UserEntity } from "#models/user/entities/user.entity"

import { CreateActivityRecordDto } from "./dto/create-activity-record.dto"
import { SearchActivityRecordsQueryDto } from "./dto/search-activity-records-query.dto"
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
    authorizedUser,
    query,
  }: {
    authorizedUser: UserEntity
    query: SearchActivityRecordsQueryDto
  }): Promise<ActivityRecordEntity[]> {
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

    const accessibleCategoriesOfSelectedBoards = await this.activityCategoriesService.search({
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

    return this.activityRecordsRepository.find({
      order: {
        id: query.orderingById ?? "desc",
        date: query.orderingById ?? "desc",
      },
      // relations: { category: { board: true, type: true } },
      skip: query.skip === undefined ? 0 : parseInt(query.skip),
      ...(query.take !== undefined && { take: parseInt(query.take) }),
      where: {
        ...(query.date !== undefined && { date: In(query.date.split(",")) }),
        ...(query.id !== undefined && { id: In(query.id.split(",")) }),
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
      // relations: { category: { board: true, type: true } },
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
    payload,
  }: {
    authorizedUser: UserEntity
    payload: CreateActivityRecordDto
  }): Promise<ActivityRecordEntity> {
    if (payload.categoryId === undefined) {
      throw new BadRequestException({ fields: { categoryId: "Required field." } })
    }
    if (payload.date === undefined) {
      throw new BadRequestException({ fields: { date: "Required field." } })
    }
    if (!/\d\d\d\d-\d\d-\d\d/.test(payload.date)) {
      throw new BadRequestException({ fields: { date: "Should have format YYYY-MM-DD." } })
    }
    const category = await this.activityCategoriesService
      .find({ authorizedUser, categoryId: payload.categoryId })
      .catch(() => {
        throw new BadRequestException({ fields: { categoryId: "Invalid category." } })
      })
    if (category.owner.id !== authorizedUser.id) {
      throw new ForbiddenException({ message: "Access denied." })
    }
    if (category.measurementType.id === 1 && typeof payload.quantitativeValue !== "number") {
      throw new BadRequestException({
        fields: {
          categoryId: "Amount should be filled for «Quantitative» activity.",
          quantitativeValue: "Amount should be filled for «Quantitative» activity.",
        },
      })
    }
    if (category.measurementType.id === 2 && typeof payload.booleanValue !== "boolean") {
      throw new BadRequestException({
        fields: {
          categoryId: "Yes-no option should be filled for «Yes / no» activity.",
          booleanValue: "Yes-no option should be filled for «Yes / no» activity.",
        },
      })
    }
    const record = this.activityRecordsRepository.create(payload)
    record.category = category
    const createdRecord = await this.activityRecordsRepository.save(record)
    return await this.find({ authorizedUser, recordId: createdRecord.id })
  }

  async update({
    authorizedUser,
    recordId,
    payload,
  }: {
    authorizedUser: UserEntity
    recordId: ActivityRecordEntity["id"]
    payload: UpdateActivityRecordDto
  }): Promise<ActivityRecordEntity> {
    const record = await this.find({ authorizedUser, recordId })
    if (record.category.id !== authorizedUser.id) {
      throw new ForbiddenException({ message: "Access denied." })
    }
    if (
      payload.booleanValue === undefined &&
      payload.categoryId === undefined &&
      payload.comment === undefined &&
      payload.date === undefined &&
      payload.quantitativeValue === undefined
    ) {
      return record
    }
    if (payload.booleanValue !== undefined) {
      record.booleanValue = payload.booleanValue
    }
    if (payload.quantitativeValue !== undefined) {
      record.quantitativeValue = payload.quantitativeValue
    }
    if (payload.comment !== undefined) {
      if (typeof payload.comment !== "string") {
        throw new BadRequestException({ fields: { comment: "Must be a string." } })
      }
      record.comment = payload.comment
    }
    if (payload.date !== undefined) {
      if (!/\d\d\d\d-\d\d-\d\d/.test(payload.date)) {
        throw new BadRequestException({ fields: { date: "Should have format YYYY-MM-DD." } })
      }
      record.date = payload.date
    }
    if (payload.categoryId !== undefined) {
      const category = await this.activityCategoriesService
        .find({ authorizedUser, categoryId: payload.categoryId })
        .catch(() => {
          throw new BadRequestException({ fields: { categoryId: "Invalid category." } })
        })
      record.category = category
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

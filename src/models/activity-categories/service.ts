import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, IsNull, Repository } from "typeorm"

import { ActivityCategoryMeasurementTypesService } from "#models/activity-category-measurement-types/service"
import { BoardsService } from "#models/boards/service"
import { UserEntity } from "#models/users/entities/user.entity"

import { GqlError } from "#helpers/GqlError"

import { ErrorMessage, GqlErrorCode } from "#constants"

import { CreateActivityCategoryInput } from "./dto/create-activity-category.input"
import { SearchActivityCategoriesArgs } from "./dto/search-activity-categories.args"
import { UpdateActivityCategoryInput } from "./dto/update-activity-category.input"
import { ActivityCategoryEntity } from "./entities/activity-category.entity"

@Injectable()
export class ActivityCategoriesService {
  constructor(
    @InjectRepository(ActivityCategoryEntity)
    private activityCategoriesRepository: Repository<ActivityCategoryEntity>,
    private activityCategoryMeasurementTypesService: ActivityCategoryMeasurementTypesService,
    private boardsService: BoardsService
  ) {}

  async search({
    args,
    authorizedUser,
  }: {
    args: SearchActivityCategoriesArgs
    authorizedUser: UserEntity
  }): Promise<ActivityCategoryEntity[]> {
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

    return this.activityCategoriesRepository.find({
      order: { id: "ASC", name: "ASC" },
      relations: { board: true, measurementType: true, owner: true },
      where: {
        ...(args.ids !== undefined && { id: In(args.ids) }),
        ...(args.ownersIds !== undefined && { owner: In(args.ownersIds) }),
        board: { id: In(boardsIdsToSearchWith) },
      },
    })
  }

  async find({
    authorizedUser,
    categoryId,
  }: {
    authorizedUser: UserEntity
    categoryId: ActivityCategoryEntity["id"]
  }): Promise<ActivityCategoryEntity> {
    const category = await this.activityCategoriesRepository.findOne({
      relations: { board: true, measurementType: true, owner: true },
      where: { id: categoryId },
    })
    if (category === null) throw new GqlError(GqlErrorCode.BAD_REQUEST, { message: "Not found." })

    const isAuthorizedUserBoardAdmin = authorizedUser.administratedBoards.some((board) => {
      return board.id === category.board.id
    })
    const isAuthorizedUserBoardMember = authorizedUser.participatedBoards.some((board) => {
      return board.id === category.board.id
    })
    const canAuthorizedUserFetchThisCategory = isAuthorizedUserBoardAdmin || isAuthorizedUserBoardMember
    if (!canAuthorizedUserFetchThisCategory) {
      throw new GqlError(GqlErrorCode.FORBIDDEN, { message: ErrorMessage.ACCESS_DENIED })
    }

    return category
  }

  async create({
    authorizedUser,
    input,
  }: {
    authorizedUser: UserEntity
    input: CreateActivityCategoryInput
  }): Promise<ActivityCategoryEntity> {
    if (input.measurementTypeId === 1) {
      if (input.unit === null || input.unit.length === 0) {
        throw new GqlError(GqlErrorCode.BAD_REQUEST, {
          fields: {
            measurementTypeId: "Unit is required for «Quantitative» activities.",
            unit: "Unit is required for «Quantitative» activities.",
          },
        })
      }
    }
    const measurementType = await this.activityCategoryMeasurementTypesService
      .find({ typeId: input.measurementTypeId })
      .catch(() => {
        throw new GqlError(GqlErrorCode.BAD_REQUEST, { fields: { measurementTypeId: ErrorMessage.INVALID_VALUE } })
      })
    const board = await this.boardsService.find({ boardId: input.boardId }).catch(() => {
      throw new GqlError(GqlErrorCode.BAD_REQUEST, { fields: { boardId: ErrorMessage.INVALID_VALUE } })
    })
    const similarExistingCategory = await this.activityCategoriesRepository.findOne({
      relations: { board: true, measurementType: true, owner: true },
      where: {
        board: {
          id: board.id,
        },
        measurementType,
        name: input.name,
        owner: {
          id: authorizedUser.id,
        },
        unit: input.unit === null ? IsNull() : input.unit,
      },
    })
    if (similarExistingCategory !== null) {
      throw new GqlError(GqlErrorCode.BAD_REQUEST, {
        fields: {
          boardId: `Similar «${similarExistingCategory.name}» category already exists in this board.`,
          measurementType: `Similar «${similarExistingCategory.name}» category already exists in this board.`,
          name: `Similar «${similarExistingCategory.name}» category already exists in this board.`,
          unit: `Similar «${similarExistingCategory.name}» category already exists in this board.`,
        },
      })
    }
    const category = this.activityCategoriesRepository.create({
      board,
      measurementType,
      name: input.name,
      owner: authorizedUser,
      unit: input.unit,
    })
    const createdCategory = await this.activityCategoriesRepository.save(category)
    return await this.find({ authorizedUser, categoryId: createdCategory.id })
  }

  async update({
    authorizedUser,
    input,
  }: {
    authorizedUser: UserEntity
    input: UpdateActivityCategoryInput
  }): Promise<ActivityCategoryEntity> {
    const category = await this.find({ authorizedUser, categoryId: input.id })

    const isAuthorizedUserBoardAdmin = authorizedUser.administratedBoards.some((board) => {
      return board.id === category.board.id
    })
    const isAuthorizedUserBoardMember = authorizedUser.participatedBoards.some((board) => {
      return board.id === category.board.id
    })
    const doesAuthorizedUserOwnThisCategory = category.owner.id === authorizedUser.id
    const canAuthorizedUserEditThisCategory =
      isAuthorizedUserBoardAdmin || (isAuthorizedUserBoardMember && doesAuthorizedUserOwnThisCategory)
    if (!canAuthorizedUserEditThisCategory) {
      throw new GqlError(GqlErrorCode.FORBIDDEN, { message: ErrorMessage.ACCESS_DENIED })
    }
    if (
      input.boardId === undefined &&
      input.measurementTypeId === undefined &&
      input.name === undefined &&
      input.unit === undefined
    ) {
      return category
    }

    if (input.measurementTypeId !== undefined) {
      category.measurementType = await this.activityCategoryMeasurementTypesService
        .find({ typeId: input.measurementTypeId })
        .catch(() => {
          throw new GqlError(GqlErrorCode.BAD_REQUEST, { fields: { measurementTypeId: ErrorMessage.INVALID_VALUE } })
        })
    }
    if (input.boardId !== undefined) {
      category.board = await this.boardsService.find({ boardId: input.boardId }).catch(() => {
        throw new GqlError(GqlErrorCode.BAD_REQUEST, { fields: { boardId: ErrorMessage.INVALID_VALUE } })
      })
    }
    if (input.name !== undefined) {
      category.name = input.name
    }
    if (input.unit !== undefined) {
      category.unit = input.unit
    }
    if (category.measurementType.id === 1) {
      if (typeof category.unit !== "string" || category.unit === "") {
        throw new GqlError(GqlErrorCode.BAD_REQUEST, {
          fields: {
            measurementTypeId: "Unit is required for «Quantitative» activities.",
            unit: "Unit is required for «Quantitative» activities.",
          },
        })
      }
    }
    const similarExistingCategory = await this.activityCategoriesRepository.findOne({
      relations: { board: true, measurementType: true, owner: true },
      where: {
        board: {
          id: category.board.id,
        },
        measurementType: category.measurementType,
        name: category.name,
        owner: {
          id: category.owner.id,
        },
        unit: category.unit === null ? IsNull() : category.unit,
      },
    })
    if (similarExistingCategory !== null) {
      throw new GqlError(GqlErrorCode.BAD_REQUEST, {
        fields: {
          boardId: `Similar «${similarExistingCategory.name}» category already exists in this board.`,
          measurementType: `Similar «${similarExistingCategory.name}» category already exists in this board.`,
          name: `Similar «${similarExistingCategory.name}» category already exists in this board.`,
          unit: `Similar «${similarExistingCategory.name}» category already exists in this board.`,
        },
      })
    }
    await this.activityCategoriesRepository.save(category)
    return await this.find({ authorizedUser, categoryId: input.id })
  }

  async delete({
    authorizedUser,
    categoryId,
  }: {
    authorizedUser: UserEntity
    categoryId: ActivityCategoryEntity["id"]
  }): Promise<ActivityCategoryEntity> {
    const category = await this.find({ authorizedUser, categoryId })

    const isAuthorizedUserBoardAdmin = authorizedUser.administratedBoards.some((board) => {
      return board.id === category.board.id
    })
    const isAuthorizedUserBoardMember = authorizedUser.participatedBoards.some((board) => {
      return board.id === category.board.id
    })
    const doesAuthorizedUserOwnThisCategory = category.owner.id === authorizedUser.id
    const canAuthorizedUserDeleteThisCategory =
      isAuthorizedUserBoardAdmin || (isAuthorizedUserBoardMember && doesAuthorizedUserOwnThisCategory)
    if (!canAuthorizedUserDeleteThisCategory) {
      throw new GqlError(GqlErrorCode.FORBIDDEN, { message: ErrorMessage.ACCESS_DENIED })
    }

    await this.activityCategoriesRepository.delete(categoryId)
    return category
  }
}

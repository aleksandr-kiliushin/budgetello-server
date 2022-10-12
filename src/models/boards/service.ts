import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Like, Repository } from "typeorm"

import { BoardSubjectsService } from "#models/board-subjects/service"
import { UserEntity } from "#models/user/entities/user.entity"
import { UserService } from "#models/user/service"

import { CreateBoardDto } from "./dto/create-board.dto"
import { SearchBoardsQueryDto } from "./dto/search-boards-query.dto"
import { UpdateBoardDto } from "./dto/update-board.dto"
import { BoardEntity } from "./entities/board.entity"

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardEntity)
    private boardsRepository: Repository<BoardEntity>,
    private boardSubjectsService: BoardSubjectsService,
    private userService: UserService
  ) {}

  async search({
    authorizedUser,
    query,
  }: {
    authorizedUser: UserEntity
    query: SearchBoardsQueryDto
  }): Promise<BoardEntity[]> {
    let boardIdsToSearchBy = (await this.boardsRepository.find()).map((board) => board.id)
    const authorizedUserAdministratedBoardsIds = authorizedUser.administratedBoards.map((board) => board.id)
    if (query.iAmAdminOf === "true") {
      boardIdsToSearchBy = boardIdsToSearchBy.filter((boardId) => {
        return authorizedUserAdministratedBoardsIds.includes(boardId)
      })
    }
    if (query.iAmAdminOf === "false") {
      boardIdsToSearchBy = boardIdsToSearchBy.filter((boardId) => {
        return !authorizedUserAdministratedBoardsIds.includes(boardId)
      })
    }
    const authorizedUserParticipatedBoardsIds = authorizedUser.boards.map((board) => board.id)
    if (query.iAmMemberOf === "true") {
      boardIdsToSearchBy = boardIdsToSearchBy.filter((boardId) => {
        return authorizedUserParticipatedBoardsIds.includes(boardId)
      })
    }
    if (query.iAmMemberOf === "false") {
      boardIdsToSearchBy = boardIdsToSearchBy.filter((boardId) => {
        return !authorizedUserParticipatedBoardsIds.includes(boardId)
      })
    }
    if (query.id !== undefined) {
      const queryId = query.id
      boardIdsToSearchBy = boardIdsToSearchBy.filter((boardId) => {
        return queryId.split(",").map(Number).includes(boardId)
      })
    }

    return this.boardsRepository.find({
      order: {
        id: "asc",
        members: { id: "asc" },
      },
      relations: { admins: true, members: true, subject: true },
      where: {
        id: In(boardIdsToSearchBy),
        ...(query.subjectId !== undefined && { subject: In(query.subjectId.split(",")) }),
        ...(query.name !== undefined && { name: Like(`%${query.name}%`) }),
      },
    })
  }

  async find({ boardId }: { boardId: BoardEntity["id"] }): Promise<BoardEntity> {
    const board = await this.boardsRepository.findOne({
      order: {
        admins: { id: "asc" },
        members: { id: "asc" },
      },
      relations: { admins: true, members: true, subject: true },
      where: { id: boardId },
    })
    if (board === null) throw new NotFoundException({})
    return board
  }

  async create({
    authorizedUser,
    requestBody,
  }: {
    authorizedUser: UserEntity
    requestBody: CreateBoardDto
  }): Promise<BoardEntity> {
    if (requestBody.name === undefined || requestBody.name === "") {
      throw new BadRequestException({ fields: { name: "Required field." } })
    }
    if (requestBody.subjectId === undefined) {
      throw new BadRequestException({ fields: { subjectId: "Required field." } })
    }
    const subject = await this.boardSubjectsService.find({ boardSubjectId: requestBody.subjectId }).catch(() => {
      throw new BadRequestException({ fields: { subjectId: "Invalid subject." } })
    })
    const similarExistingBoard = await this.boardsRepository.findOne({
      relations: { subject: true },
      where: { name: requestBody.name, subject },
    })
    if (similarExistingBoard !== null) {
      throw new BadRequestException({
        fields: {
          name: `"${similarExistingBoard.name}" ${similarExistingBoard.subject.name} board already exists.`,
          subjectId: `"${similarExistingBoard.name}" ${similarExistingBoard.subject.name} board already exists.`,
        },
      })
    }
    const board = this.boardsRepository.create({
      admins: [authorizedUser],
      members: [authorizedUser],
      name: requestBody.name,
      subject,
    })
    const newlyCreatedBoard = await this.boardsRepository.save(board)
    return await this.find({ boardId: newlyCreatedBoard.id })
  }

  async update({
    authorizedUser,
    boardId,
    requestBody,
  }: {
    authorizedUser: UserEntity
    boardId: BoardEntity["id"]
    requestBody: UpdateBoardDto
  }): Promise<BoardEntity> {
    const board = await this.find({ boardId })
    if (board.admins.every((admin) => admin.id !== authorizedUser.id)) {
      throw new ForbiddenException({ message: "You are not allowed to to this action." })
    }
    if (requestBody.name === undefined && requestBody.subjectId === undefined) {
      return board
    }
    if (requestBody.name !== undefined) {
      if (requestBody.name === "") {
        throw new BadRequestException({ fields: { name: "Name cannot be empty." } })
      }
      board.name = requestBody.name
    }
    if (requestBody.subjectId !== undefined) {
      try {
        board.subject = await this.boardSubjectsService.find({ boardSubjectId: requestBody.subjectId })
      } catch {
        throw new BadRequestException({ fields: { subjectId: "Invalid board subject." } })
      }
    }
    const similarExistingBoard = await this.boardsRepository.findOne({
      relations: { subject: true },
      where: { name: board.name, subject: board.subject },
    })
    if (similarExistingBoard !== null) {
      throw new BadRequestException({
        fields: {
          name: `"${similarExistingBoard.name}" ${similarExistingBoard.subject.name} board already exists.`,
          subjectId: `"${similarExistingBoard.name}" ${similarExistingBoard.subject.name} board already exists.`,
        },
      })
    }
    return this.boardsRepository.save(board)
  }

  async delete({
    authorizedUser,
    boardId,
  }: {
    authorizedUser: UserEntity
    boardId: BoardEntity["id"]
  }): Promise<BoardEntity> {
    const board = await this.find({ boardId })
    if (board.admins.every((admin) => admin.id !== authorizedUser.id)) {
      throw new ForbiddenException({ message: "You are not allowed to to this action." })
    }
    await this.boardsRepository.delete(boardId)
    return board
  }

  async addMember({
    authorizedUser,
    boardId,
    candidateForMembershipId,
  }: {
    authorizedUser: UserEntity
    boardId: BoardEntity["id"]
    candidateForMembershipId: UserEntity["id"]
  }): Promise<BoardEntity> {
    if (authorizedUser.administratedBoards.every((board) => board.id !== boardId)) {
      throw new ForbiddenException({ message: "Access denied." })
    }
    const candidateToMembers = await this.userService.find({
      userId: candidateForMembershipId,
      relations: { boards: true },
    })
    if (candidateToMembers.boards.some((board) => board.id === boardId)) {
      throw new BadRequestException({ message: "The user is already a member of the board." })
    }
    const board = await this.find({ boardId })
    board.members = [...board.members, candidateToMembers]
    await this.boardsRepository.save(board)
    return await this.find({ boardId })
  }

  // async join({
  //   authorizedUser,
  //   boardId,
  // }: {
  //   authorizedUser: UserEntity
  //   boardId: BoardEntity["id"]
  // }): Promise<BoardEntity> {
  //   const board = await this.find({ boardId })
  //   if (board.members.some((member) => member.id === authorizedUser.id)) {
  //     throw new BadRequestException({ message: "You are already a member of this board." })
  //   }
  //   board.members = [...board.members, authorizedUser]
  //   await this.boardsRepository.save(board)
  //   return await this.find({ boardId })
  // }

  async leave({
    authorizedUser,
    boardId,
  }: {
    authorizedUser: UserEntity
    boardId: BoardEntity["id"]
  }): Promise<BoardEntity> {
    const board = await this.find({ boardId })
    if (board.members.every((member) => member.id !== authorizedUser.id)) {
      throw new BadRequestException({ message: "You can't leave this board because you are not it's member." })
    }
    if (board.admins.length === 1 && board.admins.every((admin) => admin.id === authorizedUser.id)) {
      throw new BadRequestException({
        message: "You can't leave a board where you are the only admin. You can delete the board.",
      })
    }
    board.members = board.members.filter((member) => member.id !== authorizedUser.id)
    return this.boardsRepository.save(board)
  }
}

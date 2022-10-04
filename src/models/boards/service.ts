import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Like, Repository } from "typeorm"

import { BoardSubjectsService } from "#models/board-subjects/service"
import { UserEntity } from "#models/user/entities/user.entity"

import { CreateBoardDto } from "./dto/create-board.dto"
import { SearchBoardsQueryDto } from "./dto/search-boards-query.dto"
import { UpdateBoardDto } from "./dto/update-board.dto"
import { BoardEntity } from "./entities/board.entity"

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardEntity)
    private boardsRepository: Repository<BoardEntity>,
    private boardSubjectsService: BoardSubjectsService
  ) {}

  search({ query }: { query: SearchBoardsQueryDto }): Promise<BoardEntity[]> {
    return this.boardsRepository.find({
      order: {
        members: { id: "asc" },
      },
      relations: { admins: true, members: true, subject: true },
      where: {
        ...(query.id !== undefined && { id: In(query.id.split(",")) }),
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
    createBoardDto,
  }: {
    authorizedUser: UserEntity
    createBoardDto: CreateBoardDto
  }): Promise<BoardEntity> {
    if (createBoardDto.name === undefined || createBoardDto.name === "") {
      throw new BadRequestException({ fields: { name: "Required field." } })
    }
    if (createBoardDto.subjectId === undefined) {
      throw new BadRequestException({ fields: { subjectId: "Required field." } })
    }
    const subject = await this.boardSubjectsService.find({ boardSubjectId: createBoardDto.subjectId }).catch(() => {
      throw new BadRequestException({ fields: { subjectId: "Invalid subject." } })
    })
    const theSameExistingBoard = await this.boardsRepository.findOne({
      relations: { subject: true },
      where: { name: createBoardDto.name, subject },
    })
    if (theSameExistingBoard !== null) {
      throw new BadRequestException({
        fields: {
          name: `"${theSameExistingBoard.name}" ${theSameExistingBoard.subject.name} board already exists.`,
          subjectId: `"${theSameExistingBoard.name}" ${theSameExistingBoard.subject.name} board already exists.`,
        },
      })
    }
    const board = this.boardsRepository.create({
      admins: [authorizedUser],
      members: [authorizedUser],
      name: createBoardDto.name,
      subject,
    })
    const newlyCreatedBoard = await this.boardsRepository.save(board)
    return await this.find({ boardId: newlyCreatedBoard.id })
  }

  async update({
    authorizedUser,
    boardId,
    updateBoardDto,
  }: {
    authorizedUser: UserEntity
    boardId: BoardEntity["id"]
    updateBoardDto: UpdateBoardDto
  }): Promise<BoardEntity> {
    const board = await this.find({ boardId })
    if (board.admins.every((admin) => admin.id !== authorizedUser.id)) {
      throw new ForbiddenException({ message: "You are not allowed to to this action." })
    }
    if (updateBoardDto.name === undefined && updateBoardDto.subjectId === undefined) {
      return board
    }
    if (updateBoardDto.name !== undefined) {
      if (updateBoardDto.name === "") {
        throw new BadRequestException({ fields: { name: "Name cannot be empty." } })
      }
      board.name = updateBoardDto.name
    }
    if (updateBoardDto.subjectId !== undefined) {
      try {
        board.subject = await this.boardSubjectsService.find({ boardSubjectId: updateBoardDto.subjectId })
      } catch {
        throw new BadRequestException({ fields: { subjectId: "Invalid board subject." } })
      }
    }
    const theSameExistingBoard = await this.boardsRepository.findOne({
      relations: { subject: true },
      where: { name: board.name, subject: board.subject },
    })
    if (theSameExistingBoard !== null) {
      throw new BadRequestException({
        fields: {
          name: `"${theSameExistingBoard.name}" ${theSameExistingBoard.subject.name} board already exists.`,
          subjectId: `"${theSameExistingBoard.name}" ${theSameExistingBoard.subject.name} board already exists.`,
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

  async join({
    authorizedUser,
    boardId,
  }: {
    authorizedUser: UserEntity
    boardId: BoardEntity["id"]
  }): Promise<BoardEntity> {
    const board = await this.find({ boardId })
    if (board.members.some((member) => member.id === authorizedUser.id)) {
      throw new BadRequestException({ message: "You are already a member of this board." })
    }
    board.members = [...board.members, authorizedUser]
    await this.boardsRepository.save(board)
    return await this.find({ boardId })
  }

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

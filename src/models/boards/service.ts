import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Like, Repository } from "typeorm"

import { BoardSubjectEntity } from "#models/board-subjects/entities/board-subject.entity"
import { BoardSubjectsService } from "#models/board-subjects/service"
import { UserService } from "#models/user/service"

import { IUser } from "#interfaces/user"

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

  search(query: SearchBoardsQueryDto): Promise<BoardEntity[]> {
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

  async findById(id: BoardEntity["id"]): Promise<BoardEntity> {
    const board = await this.boardsRepository.findOne({
      order: {
        members: { id: "asc" },
      },
      relations: { admins: true, members: true, subject: true },
      where: { id },
    })
    if (board === null) throw new NotFoundException({})
    return board
  }

  async create({
    authorizedUserId,
    createBoardDto,
  }: {
    authorizedUserId: IUser["id"]
    createBoardDto: CreateBoardDto
  }): Promise<BoardEntity> {
    if (createBoardDto.name === undefined || createBoardDto.name === "") {
      throw new BadRequestException({ fields: { name: "Required field." } })
    }
    if (createBoardDto.subjectId === undefined) {
      throw new BadRequestException({ fields: { subjectId: "Required field." } })
    }
    let subject: BoardSubjectEntity | undefined
    // TODO: Refactor with .catch() method.
    try {
      subject = await this.boardSubjectsService.findById(createBoardDto.subjectId)
    } catch {
      throw new BadRequestException({ fields: { subjectId: "Invalid subject." } })
    }
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
    const authorizedUser = await this.userService.findUser({ id: authorizedUserId })
    const board = this.boardsRepository.create({
      admins: [authorizedUser],
      members: [authorizedUser],
      name: createBoardDto.name,
      subject,
    })
    return this.boardsRepository.save(board)
  }

  async update({
    authorizedUserId,
    boardId,
    updateBoardDto,
  }: {
    authorizedUserId: IUser["id"]
    boardId: BoardEntity["id"]
    updateBoardDto: UpdateBoardDto
  }): Promise<BoardEntity> {
    const board = await this.findById(boardId)
    if (board.admins.every((admin) => admin.id !== authorizedUserId)) {
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
        board.subject = await this.boardSubjectsService.findById(updateBoardDto.subjectId)
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
    authorizedUserId,
    boardId,
  }: {
    authorizedUserId: IUser["id"]
    boardId: BoardEntity["id"]
  }): Promise<BoardEntity> {
    const board = await this.findById(boardId)
    if (board.admins.every((admin) => admin.id !== authorizedUserId)) {
      throw new ForbiddenException({ message: "You are not allowed to to this action." })
    }
    await this.boardsRepository.delete(boardId)
    return board
  }

  async join({
    authorizedUserId,
    boardId,
  }: {
    authorizedUserId: IUser["id"]
    boardId: BoardEntity["id"]
  }): Promise<BoardEntity> {
    const board = await this.findById(boardId)
    if (board.members.some((member) => member.id === authorizedUserId)) {
      throw new BadRequestException({ message: "You are already a member of this board." })
    }
    const authorizedUser = await this.userService.findUser({ id: authorizedUserId })
    board.members = [...board.members, authorizedUser]
    return this.boardsRepository.save(board)
  }

  async leave({
    authorizedUserId,
    boardId,
  }: {
    authorizedUserId: IUser["id"]
    boardId: BoardEntity["id"]
  }): Promise<BoardEntity> {
    const board = await this.findById(boardId)
    if (board.members.every((member) => member.id !== authorizedUserId)) {
      throw new BadRequestException({ message: "You can't leave this board because you are not it's member." })
    }
    if (board.admins.length === 1 && board.admins.every((admin) => admin.id === authorizedUserId)) {
      throw new BadRequestException({
        message: "You can't leave a board where you are the only admin. You can delete the board.",
      })
    }
    board.members = board.members.filter((member) => member.id !== authorizedUserId)
    return this.boardsRepository.save(board)
  }
}

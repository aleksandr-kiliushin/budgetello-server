import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/user/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { CreateBoardDto } from "./dto/create-board.dto"
import { SearchBoardsQueryDto } from "./dto/search-boards-query.dto"
import { UpdateBoardDto } from "./dto/update-board.dto"
import { BoardsService } from "./service"

@Controller("boards")
@UseGuards(AuthGuard)
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get("search")
  search(
    @Query()
    query: SearchBoardsQueryDto
  ) {
    return this.boardsService.search({ query })
  }

  @Get(":id")
  find(
    @Param("id")
    boardId: string
  ) {
    return this.boardsService.find({ boardId: parseInt(boardId) })
  }

  @Post()
  create(
    @Body()
    requestBody: CreateBoardDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.create({ authorizedUser, requestBody })
  }

  @Post(":id/participating")
  join(
    @Param("id")
    boardId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.join({ authorizedUser, boardId: parseInt(boardId) })
  }

  @Delete(":id/participating")
  leave(
    @Param("id")
    boardId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.leave({ authorizedUser, boardId: parseInt(boardId) })
  }

  @Patch(":id")
  update(
    @Param("id")
    boardId: string,
    @Body()
    requestBody: UpdateBoardDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.update({ authorizedUser, boardId: parseInt(boardId), requestBody })
  }

  @Delete(":id")
  delete(
    @Param("id")
    boardId: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.delete({ authorizedUser, boardId: parseInt(boardId) })
  }
}

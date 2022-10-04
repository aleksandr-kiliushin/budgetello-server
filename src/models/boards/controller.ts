import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { AuthorizedUserId } from "#helpers/AuthorizedUserId.decorator"

import { IUser } from "#interfaces/user"

import { CreateBoardDto } from "./dto/create-board.dto"
import { SearchBoardsQueryDto } from "./dto/search-boards-query.dto"
import { UpdateBoardDto } from "./dto/update-board.dto"
import { BoardsService } from "./service"

@Controller("boards")
@UseGuards(AuthGuard)
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get("search")
  search(@Query() query: SearchBoardsQueryDto) {
    return this.boardsService.search(query)
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.boardsService.findById(parseInt(id))
  }

  @Post()
  create(
    @Body()
    createBoardDto: CreateBoardDto,
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.boardsService.create({ authorizedUserId, createBoardDto })
  }

  @Post(":id/participating")
  join(
    @Param("id")
    id: string,
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.boardsService.join({ authorizedUserId, boardId: parseInt(id) })
  }

  @Delete(":id/participating")
  leave(
    @Param("id")
    id: string,
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.boardsService.leave({ authorizedUserId, boardId: parseInt(id) })
  }

  @Patch(":id")
  update(
    @Param("id")
    id: string,
    @Body()
    updateBoardDto: UpdateBoardDto,
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.boardsService.update({ authorizedUserId, boardId: parseInt(id), updateBoardDto })
  }

  @Delete(":id")
  delete(
    @Param("id")
    id: string,
    @AuthorizedUserId()
    authorizedUserId: IUser["id"]
  ) {
    return this.boardsService.delete({ authorizedUserId, boardId: parseInt(id) })
  }
}

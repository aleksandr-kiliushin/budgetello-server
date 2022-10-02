import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

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
    @Request()
    request: Record<string, unknown> & { userId: IUser["id"] }
  ) {
    return this.boardsService.create({ authorizedUserId: request.userId, createBoardDto })
  }

  @Post(":id/participating")
  join(
    @Param("id")
    id: string,
    @Request()
    request: Record<string, unknown> & { userId: IUser["id"] }
  ) {
    return this.boardsService.join({ authorizedUserId: request.userId, boardId: parseInt(id) })
  }

  @Delete(":id/participating")
  leave(
    @Param("id")
    id: string,
    @Request()
    request: Record<string, unknown> & { userId: IUser["id"] }
  ) {
    return this.boardsService.leave({ authorizedUserId: request.userId, boardId: parseInt(id) })
  }

  @Patch(":id")
  update(
    @Param("id")
    id: string,
    @Body()
    updateBoardDto: UpdateBoardDto,
    @Request()
    request: Record<string, unknown> & { userId: IUser["id"] }
  ) {
    return this.boardsService.update({ authorizedUserId: request.userId, boardId: parseInt(id), updateBoardDto })
  }

  @Delete(":id")
  delete(
    @Param("id")
    id: string,
    @Request()
    request: Record<string, unknown> & { userId: IUser["id"] }
  ) {
    return this.boardsService.delete({ authorizedUserId: request.userId, boardId: parseInt(id) })
  }
}

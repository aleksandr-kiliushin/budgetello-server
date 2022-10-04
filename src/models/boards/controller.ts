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
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.create({ authorizedUser, createBoardDto })
  }

  @Post(":id/participating")
  join(
    @Param("id")
    id: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.join({ authorizedUser, boardId: parseInt(id) })
  }

  @Delete(":id/participating")
  leave(
    @Param("id")
    id: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.leave({ authorizedUser, boardId: parseInt(id) })
  }

  @Patch(":id")
  update(
    @Param("id")
    id: string,
    @Body()
    updateBoardDto: UpdateBoardDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.update({ authorizedUser, boardId: parseInt(id), updateBoardDto })
  }

  @Delete(":id")
  delete(
    @Param("id")
    id: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.delete({ authorizedUser, boardId: parseInt(id) })
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"
import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"
import { ParseNumbersArrayPipe } from "#helpers/parse-numbers-array.pipe"
import { ValidationPipe } from "#helpers/validator.pipe"

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
    @Query("iAmAdminOf", ParseBoolPipe)
    iAmAdminOf: SearchBoardsQueryDto["iAmAdminOf"],
    @Query("iAmMemberOf", ParseBoolPipe)
    iAmMemberOf: SearchBoardsQueryDto["iAmMemberOf"],
    @Query("ids", ParseNumbersArrayPipe)
    ids: SearchBoardsQueryDto["ids"],
    @Query("name")
    name: SearchBoardsQueryDto["name"],
    @Query("subjectsIds", ParseNumbersArrayPipe)
    subjectsIds: SearchBoardsQueryDto["subjectsIds"],
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.search({ authorizedUser, query: { iAmAdminOf, iAmMemberOf, ids, name, subjectsIds } })
  }

  @Get(":boardId")
  find(
    @Param("boardId", ParseIntPipe)
    boardId: number
  ) {
    return this.boardsService.find({ boardId })
  }

  @Post()
  create(
    @Body(new ValidationPipe())
    requestBody: CreateBoardDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.create({ authorizedUser, requestBody })
  }

  @Post(":boardId/add-member/:candidateForMembershipId")
  addMember(
    @Param("boardId", ParseIntPipe)
    boardId: number,
    @Param("candidateForMembershipId", ParseIntPipe)
    candidateForMembershipId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.addMember({ authorizedUser, boardId, candidateForMembershipId })
  }

  @Post(":boardId/remove-member/:candidateForRemovingId")
  removeMember(
    @Param("boardId", ParseIntPipe)
    boardId: number,
    @Param("candidateForRemovingId", ParseIntPipe)
    candidateForRemovingId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.removeMember({ authorizedUser, boardId, candidateForRemovingId })
  }

  @Patch(":boardId")
  update(
    @Param("boardId", ParseIntPipe)
    boardId: number,
    @Body()
    requestBody: UpdateBoardDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.update({ authorizedUser, boardId, requestBody })
  }

  @Delete(":boardId")
  delete(
    @Param("boardId", ParseIntPipe)
    boardId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.boardsService.delete({ authorizedUser, boardId })
  }
}

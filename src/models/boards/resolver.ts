import { UseGuards } from "@nestjs/common"
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"

import { AuthorizationGuard } from "#models/authorization/guard"
import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { CreateBoardInput } from "./dto/create-board.input"
import { SearchBoardsArgs } from "./dto/search-boards.args"
import { UpdateBoardInput } from "./dto/update-board.input"
import { BoardEntity } from "./entities/board.entity"
import { Board } from "./models/board.model"
import { BoardsService } from "./service"

@Resolver(() => Board)
@UseGuards(AuthorizationGuard)
export class BoardsResolver {
  constructor(private boardsService: BoardsService) {}

  @Query((returns) => [Board], { name: "boards" })
  search(
    @Args()
    args: SearchBoardsArgs,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BoardEntity[]> {
    return this.boardsService.search({ args, authorizedUser })
  }

  @Query((returns) => Board, { name: "board" })
  find(
    @Args("id", { type: () => Int })
    boardId: number
  ): Promise<BoardEntity> {
    return this.boardsService.find({ boardId })
  }

  @Mutation((returns) => Board, { name: "createBoard" })
  create(
    @Args("input")
    input: CreateBoardInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BoardEntity> {
    return this.boardsService.create({ authorizedUser, input })
  }

  @Mutation((returns) => Board, { name: "updateBoard" })
  update(
    @Args("input")
    input: UpdateBoardInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BoardEntity> {
    return this.boardsService.update({ authorizedUser, input })
  }

  @Mutation((returns) => Board, { name: "deleteBoard" })
  delete(
    @Args("id", { type: () => Int })
    boardId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BoardEntity> {
    return this.boardsService.delete({ authorizedUser, boardId })
  }

  // @Post(":boardId/add-member/:candidateForMembershipId")
  // addMember(
  //   @Param("boardId", ParseIntPipe)
  //   boardId: number,
  //   @Param("candidateForMembershipId", ParseIntPipe)
  //   candidateForMembershipId: number,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.boardsService.addMember({ authorizedUser, boardId, candidateForMembershipId })
  // }

  // @Post(":boardId/remove-member/:candidateForRemovingId")
  // removeMember(
  //   @Param("boardId", ParseIntPipe)
  //   boardId: number,
  //   @Param("candidateForRemovingId", ParseIntPipe)
  //   candidateForRemovingId: number,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.boardsService.removeMember({ authorizedUser, boardId, candidateForRemovingId })
  // }

  // @Patch(":boardId")
  // update(
  //   @Param("boardId", ParseIntPipe)
  //   boardId: number,
  //   @Body()
  //   requestBody: UpdateBoardDto,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.boardsService.update({ authorizedUser, boardId, requestBody })
  // }

  // @Delete(":boardId")
  // delete(
  //   @Param("boardId", ParseIntPipe)
  //   boardId: number,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.boardsService.delete({ authorizedUser, boardId })
  // }
}

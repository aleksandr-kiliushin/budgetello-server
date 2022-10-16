import { UseGuards } from "@nestjs/common"
import { Args, Int, Query, Resolver } from "@nestjs/graphql"

import { AuthorizationGuard } from "#models/authorization/guard"
import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { SearchBoardsArgs } from "./dto/search-boards.args"
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
  ) {
    return this.boardsService.search({ args, authorizedUser })
  }

  @Query(() => Board, { name: "board" })
  find(
    @Args("id", { type: () => Int })
    boardId: number
  ) {
    return this.boardsService.find({ boardId })
  }

  // @Post()
  // create(
  //   @Body(new ValidationPipe())
  //   requestBody: CreateBoardDto,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.boardsService.create({ authorizedUser, requestBody })
  // }

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

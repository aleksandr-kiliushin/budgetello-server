import { UseGuards } from "@nestjs/common"
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"

import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizationGuard } from "#helpers/authorization.guard"
import { AuthorizedUser } from "#helpers/authorized-user.decorator"
import { ValidationPipe } from "#helpers/validation.pipe"

import { AddMemberInput } from "./dto/add-member.input"
import { CreateBoardInput } from "./dto/create-board.input"
import { RemoveMemberInput } from "./dto/remove-member.input"
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
    @Args("input", ValidationPipe)
    input: CreateBoardInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BoardEntity> {
    return this.boardsService.create({ authorizedUser, input })
  }

  @Mutation((returns) => Board, { name: "updateBoard" })
  update(
    @Args("input", ValidationPipe)
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

  @Mutation((returns) => Board, { name: "addBoardMember" })
  addMember(
    @Args("input")
    input: AddMemberInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BoardEntity> {
    return this.boardsService.addMember({ authorizedUser, input })
  }

  @Mutation((returns) => Board, { name: "removeBoardMember" })
  removeMember(
    @Args("input")
    input: RemoveMemberInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BoardEntity> {
    return this.boardsService.removeMember({ authorizedUser, input })
  }
}

import { UseGuards } from "@nestjs/common"
import { Args, Int, Query, Resolver } from "@nestjs/graphql"

import { AuthGuard } from "#models/auth/guard"

import { IBudgetCategoryType } from "#interfaces/budget"

import { BoardSubject } from "./models/board-subject.model"
import { BoardSubjectsService } from "./service"

@Resolver(() => BoardSubject)
@UseGuards(AuthGuard)
export class BoardSubjectsResolver {
  constructor(private boardSubjectsService: BoardSubjectsService) {}

  @Query((returns) => [BoardSubject], { name: "boardSubjects" })
  getAll() {
    return this.boardSubjectsService.getAll()
  }

  @Query((returns) => BoardSubject, { name: "boardSubject" })
  find(
    @Args("id", { type: () => Int })
    id: IBudgetCategoryType["id"]
  ) {
    return this.boardSubjectsService.find({ subjectId: id })
  }
}

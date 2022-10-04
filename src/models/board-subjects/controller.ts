import { Controller, Get, Param, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { BoardSubjectsService } from "./service"

@Controller("board-subjects")
@UseGuards(AuthGuard)
export class BoardSubjectsController {
  constructor(private readonly boardSubjectsService: BoardSubjectsService) {}

  @Get()
  getAll() {
    return this.boardSubjectsService.getAll()
  }

  @Get(":id")
  find(
    @Param("id")
    boardSubjectId: string
  ) {
    return this.boardSubjectsService.find({ boardSubjectId: parseInt(boardSubjectId) })
  }
}

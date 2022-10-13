import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common"

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

  @Get(":subjectId")
  find(
    @Param("subjectId", ParseIntPipe)
    subjectId: number
  ) {
    return this.boardSubjectsService.find({ subjectId })
  }
}

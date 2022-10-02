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
  findById(@Param("id") id: string) {
    return this.boardSubjectsService.findById(parseInt(id))
  }
}

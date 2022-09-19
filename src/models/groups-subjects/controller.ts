import { Controller, Get, Param, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { GroupsSubjectsService } from "./service"

@Controller("groups-subjects")
@UseGuards(AuthGuard)
export class GroupsSubjectsController {
  constructor(private readonly groupsSubjectsService: GroupsSubjectsService) {}

  @Get()
  getAll() {
    return this.groupsSubjectsService.getAll()
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.groupsSubjectsService.findById(parseInt(id))
  }
}

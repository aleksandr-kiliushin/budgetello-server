import { Controller, Get, Param, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { GroupsService } from "./service"

@Controller("groups")
@UseGuards(AuthGuard)
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.groupsService.findById(parseInt(id))
  }
}

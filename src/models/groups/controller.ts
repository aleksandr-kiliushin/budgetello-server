import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { SearchGroupsQueryDto } from "./dto/search-groups-query.dto"
import { GroupsService } from "./service"

@Controller("groups")
@UseGuards(AuthGuard)
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get("search")
  search(@Query() query: SearchGroupsQueryDto) {
    return this.groupsService.search(query)
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.groupsService.findById(parseInt(id))
  }
}

import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { IUser } from "#interfaces/user"

import { CreateGroupDto } from "./dto/create-group.dto"
import { SearchGroupsQueryDto } from "./dto/search-groups-query.dto"
import { UpdateGroupDto } from "./dto/update-finance-category.dto"
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

  @Post()
  create(
    @Body()
    createGroupDto: CreateGroupDto,
    @Request()
    request: Record<string, unknown> & { userId: IUser["id"] }
  ) {
    return this.groupsService.create({ authorizedUserId: request.userId, createGroupDto })
  }

  @Patch(":id")
  update(
    @Param("id")
    id: string,
    @Body()
    updateGroupDto: UpdateGroupDto,
    @Request()
    request: Record<string, unknown> & { userId: IUser["id"] }
  ) {
    return this.groupsService.update({ authorizedUserId: request.userId, groupId: parseInt(id), updateGroupDto })
  }
}

import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Like, Repository } from "typeorm"

import { SearchGroupsQueryDto } from "./dto/search-groups-query.dto"
import { GroupEntity } from "./entities/group.entity"

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupsRepository: Repository<GroupEntity>
  ) {}

  search(query: SearchGroupsQueryDto): Promise<GroupEntity[]> {
    return this.groupsRepository.find({
      relations: { subject: true, users: true },
      where: {
        ...(query.id !== undefined && { id: In(query.id.split(",")) }),
        ...(query.subjectId !== undefined && { id: In(query.subjectId.split(",")) }),
        ...(query.name !== undefined && { name: Like(`%${query.name}%`) }),
      },
    })
  }

  async findById(id: GroupEntity["id"]): Promise<GroupEntity> {
    const group = await this.groupsRepository.findOne({
      relations: { subject: true, users: true },
      where: { id },
    })
    if (group === null) throw new NotFoundException({})
    return group
  }
}

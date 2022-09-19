import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { GroupEntity } from "./entities/group.entity"

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupsRepository: Repository<GroupEntity>
  ) {}

  async findById(id: GroupEntity["id"]): Promise<GroupEntity> {
    const group = await this.groupsRepository.findOne({
      relations: { subject: true, users: true },
      where: { id },
    })
    if (group === null) throw new NotFoundException({})
    return group
  }
}

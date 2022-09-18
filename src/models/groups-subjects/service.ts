import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { GroupsSubjectsEntity } from "./entities/groups-subjects.entity"

@Injectable()
export class GroupsSubjectsService {
  constructor(
    @InjectRepository(GroupsSubjectsEntity)
    private groupsSubjectsRepository: Repository<GroupsSubjectsEntity>
  ) {}

  getAll(): Promise<GroupsSubjectsEntity[]> {
    return this.groupsSubjectsRepository.find()
  }

  findById(id: GroupsSubjectsEntity["id"]): Promise<GroupsSubjectsEntity> {
    return this.groupsSubjectsRepository.findOneOrFail({ where: { id } })
  }
}

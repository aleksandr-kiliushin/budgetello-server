import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { BoardSubjectEntity } from "./entities/board-subject.entity"

@Injectable()
export class BoardSubjectsService {
  constructor(
    @InjectRepository(BoardSubjectEntity)
    private boardSubjectsRepository: Repository<BoardSubjectEntity>
  ) {}

  getAll(): Promise<BoardSubjectEntity[]> {
    return this.boardSubjectsRepository.find()
  }

  find({ boardSubjectId }: { boardSubjectId: BoardSubjectEntity["id"] }): Promise<BoardSubjectEntity> {
    return this.boardSubjectsRepository.findOneOrFail({ where: { id: boardSubjectId } })
  }
}

import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { BoardSubjectEntity } from "#models/board-subjects/entities/board-subject.entity"
import { UserEntity } from "#models/users/entities/user.entity"

@Entity("board")
export class BoardEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number

  @ManyToMany(() => UserEntity, (user) => user.administratedBoards, { onDelete: "CASCADE" })
  admins: UserEntity[]

  @Column({ type: "varchar" })
  name: string

  @ManyToMany(() => UserEntity, (user) => user.boards, { onDelete: "CASCADE" })
  members: UserEntity[]

  @ManyToOne(() => BoardSubjectEntity)
  subject: BoardSubjectEntity
}

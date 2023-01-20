import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { BoardSubjectEntity } from "#models/board-subjects/entities/board-subject.entity"
import { CurrencyEntity } from "#models/currencies/entities/currency.entity"
import { UserEntity } from "#models/users/entities/user.entity"

@Entity("board")
export class BoardEntity {
  @ManyToMany(() => UserEntity, (user) => user.administratedBoards, { onDelete: "CASCADE" })
  admins: UserEntity[]

  @ManyToOne(() => CurrencyEntity, { nullable: true })
  defaultCurrency: CurrencyEntity

  @PrimaryGeneratedColumn({ type: "int" })
  id: number

  @Column({ type: "varchar" })
  name: string

  @ManyToMany(() => UserEntity, (user) => user.participatedBoards, { onDelete: "CASCADE" })
  members: UserEntity[]

  @ManyToOne(() => BoardSubjectEntity)
  subject: BoardSubjectEntity
}

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"

import { BoardEntity } from "#models/boards/entities/board.entity"

import { IUser } from "#interfaces/user"

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IUser["id"]

  @ManyToMany(() => BoardEntity, (board) => board.admins, { onDelete: "CASCADE" })
  @JoinTable()
  administratedBoards: BoardEntity[]

  @Column({ type: "varchar" })
  username: IUser["username"]

  @Column({ type: "varchar" })
  password: IUser["password"]

  @ManyToMany(() => BoardEntity, (board) => board.members, { onDelete: "CASCADE" })
  @JoinTable()
  boards: BoardEntity[]
}

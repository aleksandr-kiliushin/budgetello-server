import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"

import { GroupEntity } from "#models/groups/entities/group.entity"

import { IUser } from "#interfaces/user"

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IUser["id"]

  @Column({ type: "varchar" })
  username: IUser["username"]

  @Column({ type: "varchar" })
  password: IUser["password"]

  @ManyToMany(() => GroupEntity, (group) => group.users, { onDelete: "CASCADE" })
  @JoinTable()
  groups: GroupEntity[]
}

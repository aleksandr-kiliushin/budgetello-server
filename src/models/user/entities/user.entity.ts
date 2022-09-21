import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"

import { GroupEntity } from "#models/groups/entities/group.entity"

import { IUser } from "#interfaces/user"

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IUser["id"]

  @ManyToMany(() => GroupEntity, (group) => group.admins, { onDelete: "CASCADE" })
  @JoinTable()
  administratedGroups: GroupEntity[]

  @Column({ type: "varchar" })
  username: IUser["username"]

  @Column({ type: "varchar" })
  password: IUser["password"]

  @ManyToMany(() => GroupEntity, (group) => group.members, { onDelete: "CASCADE" })
  @JoinTable()
  groups: GroupEntity[]
}

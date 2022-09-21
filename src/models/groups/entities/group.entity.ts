import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { GroupsSubjectsEntity } from "#models/groups-subjects/entities/groups-subjects.entity"
import { UserEntity } from "#models/user/entities/user.entity"

@Entity("groups")
export class GroupEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number

  @ManyToMany(() => UserEntity, (user) => user.administratedGroups, { onDelete: "CASCADE" })
  admins: UserEntity[]

  @Column({ type: "varchar" })
  name: string

  @ManyToMany(() => UserEntity, (user) => user.groups, { onDelete: "CASCADE" })
  members: UserEntity[]

  @ManyToOne(() => GroupsSubjectsEntity)
  subject: GroupsSubjectsEntity
}

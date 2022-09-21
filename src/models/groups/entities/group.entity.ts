import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { GroupsSubjectsEntity } from "#models/groups-subjects/entities/groups-subjects.entity"
import { UserEntity } from "#models/user/entities/user.entity"

@Entity("groups")
export class GroupEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number

  @Column({ type: "varchar" })
  name: string

  @ManyToOne(() => GroupsSubjectsEntity)
  subject: GroupsSubjectsEntity

  @ManyToMany(() => UserEntity, (user) => user.groups, { onDelete: "CASCADE" })
  users: UserEntity[]
}

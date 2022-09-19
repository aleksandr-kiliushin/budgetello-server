import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { GroupsSubjectsEntity } from "#models/groups-subjects/entities/groups-subjects.entity"

@Entity("groups")
export class GroupEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number

  @Column({ type: "varchar" })
  name: string

  @ManyToOne(() => GroupsSubjectsEntity)
  subject: GroupsSubjectsEntity
}

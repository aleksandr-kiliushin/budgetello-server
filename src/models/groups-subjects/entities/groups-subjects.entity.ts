import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("groups_subjects")
export class GroupsSubjectsEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number

  @Column({ type: "varchar" })
  name: string
}

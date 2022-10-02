import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("board_subject")
export class BoardSubjectEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number

  @Column({ type: "varchar" })
  name: string
}

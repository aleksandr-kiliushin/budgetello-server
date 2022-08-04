import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

import { IUser } from "#interfaces/user"

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IUser["id"]

  @Column({ type: "varchar" })
  username: IUser["username"]

  @Column({ type: "varchar" })
  password: IUser["password"]
}

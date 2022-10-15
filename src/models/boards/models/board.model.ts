import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Board {
  // @ManyToMany(() => UserEntity, (user) => user.administratedBoards, { onDelete: "CASCADE" })
  // admins: UserEntity[]

  @Field(() => Int)
  id: number

  // @ManyToMany(() => UserEntity, (user) => user.boards, { onDelete: "CASCADE" })
  // members: UserEntity[]

  @Field()
  name: string

  // @ManyToOne(() => BoardSubjectEntity)
  // subject: BoardSubjectEntity
}

import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class User {
  @Field(() => Int)
  id: number

  // @ManyToMany(() => BoardEntity, (board) => board.admins, { onDelete: "CASCADE" })
  // @JoinTable()
  // administratedBoards: BoardEntity[]

  @Field()
  username: string

  @Field()
  password: string

  // @ManyToMany(() => BoardEntity, (board) => board.members, { onDelete: "CASCADE" })
  // @JoinTable()
  // boards: BoardEntity[]
}

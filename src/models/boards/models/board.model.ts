import { Field, Int, ObjectType } from "@nestjs/graphql"

import { BoardSubject } from "#models/board-subjects/models/board-subject.model"

@ObjectType()
export class Board {
  // @ManyToMany(() => UserEntity, (user) => user.administratedBoards, { onDelete: "CASCADE" })
  // admins: UserEntity[]

  @Field((type) => Int)
  id: number

  // @ManyToMany(() => UserEntity, (user) => user.boards, { onDelete: "CASCADE" })
  // members: UserEntity[]

  @Field()
  name: string

  @Field((type) => BoardSubject)
  subject: BoardSubject[]
}

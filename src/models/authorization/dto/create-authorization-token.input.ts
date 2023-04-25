import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty } from "class-validator"

import { ErrorMessage } from "#constants"

@InputType()
export class CreateAuthorizationTokenInput {
  @Field()
  @IsNotEmpty({ message: ErrorMessage.REQUIRED })
  password: string

  @Field()
  @IsNotEmpty({ message: ErrorMessage.REQUIRED })
  username: string
}

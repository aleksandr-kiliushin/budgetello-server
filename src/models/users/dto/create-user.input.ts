import { ErrorMessage } from "#constants/ErrorMessage"
import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty } from "class-validator"

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty({ message: ErrorMessage.REQUIRED })
  password: string

  @Field()
  @IsNotEmpty({ message: ErrorMessage.REQUIRED })
  passwordConfirmation: string

  @Field()
  @IsNotEmpty({ message: ErrorMessage.REQUIRED })
  username: string
}

import { ValidationError } from "#constants/ValidationError"
import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty } from "class-validator"

@InputType()
export class CreateAuthorizationTokenInput {
  @Field()
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  password: string

  @Field()
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  username: string
}

import { Args, Mutation, Resolver } from "@nestjs/graphql"

import { ValidationPipe } from "#helpers/validation.pipe"

import { AuthorizeInput } from "./dto/authorize.input"
import { AuthorizationService } from "./service"

@Resolver()
export class AuthorizationResolver {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Mutation(() => String, { name: "authorize" })
  authorize(
    @Args("input", ValidationPipe)
    input: AuthorizeInput
  ): Promise<string> {
    return this.authorizationService.createToken({ input })
  }
}

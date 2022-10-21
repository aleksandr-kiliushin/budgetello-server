import { Args, Mutation, Resolver } from "@nestjs/graphql"

import { ValidationPipe } from "#helpers/validation.pipe"

import { CreateAuthorizationTokenInput } from "./dto/create-authorization-token.input"
import { AuthorizationService } from "./service"

@Resolver()
export class AuthorizationResolver {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Mutation(() => String)
  createAuthorizationToken(
    @Args("input", ValidationPipe)
    input: CreateAuthorizationTokenInput
  ): Promise<string> {
    return this.authorizationService.createToken({ input })
  }
}

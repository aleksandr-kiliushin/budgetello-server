import { BadRequestException, UseGuards } from "@nestjs/common"
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"

import { AuthorizationGuard } from "#helpers/authorization.guard"
import { AuthorizedUser } from "#helpers/authorized-user.decorator"
import { ValidationPipe } from "#helpers/validation.pipe"

import { CreateUserInput } from "./dto/create-user.input"
import { FindUserArgs } from "./dto/find-user.args"
import { SearchUsersArgs } from "./dto/search-users.args"
import { UpdateUserInput } from "./dto/update-user.input"
import { UserEntity } from "./entities/user.entity"
import { User } from "./models/user.model"
import { UsersService } from "./service"

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => [User], { name: "users" })
  @UseGuards(AuthorizationGuard)
  search(
    @Args()
    args: SearchUsersArgs
  ): Promise<UserEntity[]> {
    return this.usersService.search({ args })
  }

  @Query((returns) => User, { name: "user" })
  @UseGuards(AuthorizationGuard)
  find(
    @Args()
    args: FindUserArgs,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<UserEntity> {
    if (args.id !== undefined) {
      return this.usersService.find({ authorizedUser, userId: args.id })
    }
    if (args.username !== undefined) {
      return this.usersService.find({ authorizedUser, userUsername: args.username })
    }
    throw new BadRequestException({
      query: {
        id: "Provide either 'id' or 'username'.",
        username: "Provide either 'id' or 'username'.",
      },
    })
  }

  @Mutation((returns) => User, { name: "createUser" })
  create(
    @Args("input", ValidationPipe)
    input: CreateUserInput
  ): Promise<UserEntity> {
    return this.usersService.create({ input })
  }

  @Mutation((returns) => User, { name: "updateUser" })
  @UseGuards(AuthorizationGuard)
  update(
    @Args("input", ValidationPipe)
    input: UpdateUserInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<UserEntity> {
    return this.usersService.update({ authorizedUser, input })
  }

  @Mutation((returns) => User, { name: "deleteUser" })
  @UseGuards(AuthorizationGuard)
  delete(
    @Args("id", { type: () => Int })
    userId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<UserEntity> {
    return this.usersService.delete({ authorizedUser, userId })
  }
}

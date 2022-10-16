import { BadRequestException, UseGuards } from "@nestjs/common"
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"

import { AuthGuard } from "#models/auth/guard"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

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
  @UseGuards(AuthGuard)
  search(
    @Args()
    args: SearchUsersArgs
  ): Promise<User[]> {
    return this.usersService.search({ args })
  }

  @Query((returns) => User, { name: "user" })
  @UseGuards(AuthGuard)
  find(
    @Args()
    args: FindUserArgs,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<User> {
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
    @Args("input")
    input: CreateUserInput
  ) {
    return this.usersService.create({ requestBody: input })
  }

  @Mutation((returns) => User, { name: "updateUser" })
  @UseGuards(AuthGuard)
  update(
    @Args("input")
    input: UpdateUserInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.usersService.update({ authorizedUser, input })
  }

  @Mutation((returns) => User, { name: "deleteUser" })
  @UseGuards(AuthGuard)
  delete(
    @Args("id", { type: () => Int })
    userId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    return this.usersService.delete({ authorizedUser, userId })
  }
}

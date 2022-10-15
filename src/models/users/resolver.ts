import { BadRequestException, UseGuards } from "@nestjs/common"
import { Args, Query, Resolver } from "@nestjs/graphql"

import { AuthGuard } from "#models/auth/guard"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { FindUserArgs } from "./dto/find-user.args"
import { SearchUsersArgs } from "./dto/search-users.args"
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

  // @Post()
  // register(
  //   @Body(new ValidationPipe())
  //   requestBody: CreateUserDto
  // ) {
  //   return this.usersService.create({ requestBody })
  // }

  // @Patch(":userId")
  // @UseGuards(AuthGuard)
  // update(
  //   @Param("userId", ParseIntPipe)
  //   userId: number,
  //   @Body()
  //   requestBody: UpdateUserDto,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   if (authorizedUser.id !== userId) {
  //     throw new ForbiddenException({ message: "You are not allowed to update another user." })
  //   }
  //   return this.usersService.update({ userId, requestBody })
  // }

  // @Delete(":id")
  // @UseGuards(AuthGuard)
  // delete(
  //   @Param("id")
  //   id: string,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   const userToBeDeletedId = parseInt(id)
  //   if (authorizedUser.id !== userToBeDeletedId) {
  //     throw new ForbiddenException({ message: "You are not allowed to delete another user." })
  //   }
  //   return this.usersService.delete({ userId: userToBeDeletedId })
  // }
}

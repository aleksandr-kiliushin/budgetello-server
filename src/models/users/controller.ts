import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"
import { ParseNumbersArrayPipe } from "#helpers/parse-numbers-array.pipe"
import { ValidationPipe } from "#helpers/validator.pipe"

import { CreateUserDto } from "./dto/create-user.dto"
import { SearchUsersDto } from "./dto/search-users.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { UserEntity } from "./entities/user.entity"
import { UsersService } from "./service"

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("search")
  @UseGuards(AuthGuard)
  searchUsers(
    @Query("ids", ParseNumbersArrayPipe) ids: SearchUsersDto["ids"],
    @Query("username", new DefaultValuePipe("")) username: SearchUsersDto["username"]
  ) {
    return this.usersService.searchUsers({ query: { ids, username } })
  }

  @Get(":userIdentifier")
  @UseGuards(AuthGuard)
  find(
    @Param("userIdentifier")
    userIdentifier: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    // If request to /api/users/john-doe.
    if (isNaN(parseInt(userIdentifier))) {
      return this.usersService.find({ authorizedUser, userUsername: userIdentifier })
    }
    // If request to /api/users/123.
    return this.usersService.find({ authorizedUser, userId: parseInt(userIdentifier) })
  }

  @Post()
  register(
    @Body(new ValidationPipe())
    requestBody: CreateUserDto
  ) {
    return this.usersService.create({ requestBody })
  }

  @Patch(":userId")
  @UseGuards(AuthGuard)
  update(
    @Param("userId", ParseIntPipe)
    userId: number,
    @Body()
    requestBody: UpdateUserDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    if (authorizedUser.id !== userId) {
      throw new ForbiddenException({ message: "You are not allowed to update another user." })
    }
    return this.usersService.update({ userId, requestBody })
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  delete(
    @Param("id")
    id: string,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    const userToBeDeletedId = parseInt(id)
    if (authorizedUser.id !== userToBeDeletedId) {
      throw new ForbiddenException({ message: "You are not allowed to delete another user." })
    }
    return this.usersService.delete({ userId: userToBeDeletedId })
  }
}

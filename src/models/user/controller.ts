import {
  Body,
  Controller,
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

import { CreateUserDto } from "./dto/create-user.dto"
import { FindUsersDto } from "./dto/find-users.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { UserEntity } from "./entities/user.entity"
import { UserService } from "./service"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("search")
  @UseGuards(AuthGuard)
  searchUsers(@Query() query: FindUsersDto) {
    return this.userService.searchUsers(query)
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
      return this.userService.find({ authorizedUser, userUsername: userIdentifier })
    }
    // If request to /api/users/123.
    return this.userService.find({ authorizedUser, userId: parseInt(userIdentifier) })
  }

  @Post()
  create(
    @Body()
    createUserDto: CreateUserDto
  ) {
    return this.userService.create(createUserDto)
  }

  @Patch(":userId")
  @UseGuards(AuthGuard)
  update(
    @Param("userId", ParseIntPipe)
    userId: number,
    @Body()
    payload: UpdateUserDto,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ) {
    if (authorizedUser.id !== userId) {
      throw new ForbiddenException({ message: "You are not allowed to update another user." })
    }
    return this.userService.update({ userId, payload })
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
    return this.userService.delete({ userId: userToBeDeletedId })
  }
}

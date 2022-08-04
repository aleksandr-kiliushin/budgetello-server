import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common"

import { AuthGuard } from "#models/auth/auth.guard"

import { IUser } from "#interfaces/user"

import { CreateUserDto } from "./dto/create-user.dto"
import { FindUsersDto } from "./dto/find-users.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { UserService } from "./user.service"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("search")
  @UseGuards(AuthGuard)
  findUsers(@Query() query: FindUsersDto) {
    return this.userService.findUsers(query)
  }

  @Get(":userIdentifier")
  @UseGuards(AuthGuard)
  findUser(
    @Request()
    req: { userId: IUser["id"] },
    @Param("userIdentifier")
    userIdentifier: string
  ) {
    if (isNaN(parseInt(userIdentifier))) {
      return this.userService.findUser({ loggedInUserId: req.userId, username: userIdentifier })
    }
    return this.userService.findUser({ loggedInUserId: req.userId, id: parseInt(userIdentifier) })
  }

  @Post()
  createUser(
    @Body()
    createUserDto: CreateUserDto
  ) {
    return this.userService.createUser(createUserDto)
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  updateUser(
    @Param("id")
    id: string,
    @Body()
    updateUserDto: UpdateUserDto,
    @Request()
    req: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    const userToBeUpdatedId = parseInt(id)
    if (req.userId !== userToBeUpdatedId) {
      throw new ForbiddenException({ message: "You are not allowed to update another user." })
    }
    return this.userService.updateUser(userToBeUpdatedId, updateUserDto)
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  deleteUser(
    @Param("id")
    id: string,
    @Request()
    req: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    const userToBeDeletedId = parseInt(id)
    if (req.userId !== userToBeDeletedId) {
      throw new ForbiddenException({ message: "You are not allowed to delete another user." })
    }
    return this.userService.deleteUser(userToBeDeletedId)
  }
}

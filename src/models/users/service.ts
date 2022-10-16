import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsRelations, In, Like, Repository } from "typeorm"

import { encrypt } from "#utils/crypto"

import { IUser } from "#interfaces/user"

import { CreateUserInput } from "./dto/create-user.input"
import { SearchUsersArgs } from "./dto/search-users.args"
import { UpdateUserInput } from "./dto/update-user.input"
import { UserEntity } from "./entities/user.entity"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async find({
    authorizedUser,
    userId,
    relations,
    userUsername,
  }: {
    authorizedUser?: UserEntity
    userId?: IUser["id"]
    relations?: FindOptionsRelations<UserEntity>
    userUsername?: IUser["username"]
  }): Promise<UserEntity> {
    let user: UserEntity | null = null

    if (userId === 0 && authorizedUser !== undefined) {
      user = await this.userRepository.findOne({
        where: { id: authorizedUser.id },
        ...(relations !== undefined && { relations }),
      })
    }
    if (userId !== undefined && userId !== 0) {
      user = await this.userRepository.findOne({
        where: { id: userId },
        ...(relations !== undefined && { relations }),
      })
    }
    if (userUsername !== undefined) {
      user = await this.userRepository.findOne({
        where: { username: userUsername },
        ...(relations !== undefined && { relations: relations }),
      })
    }

    if (user === null) throw new NotFoundException({})
    return user
  }

  search({ args }: { args: SearchUsersArgs }): Promise<UserEntity[]> {
    return this.userRepository.findBy({
      ...(args.ids !== undefined && { id: In(args.ids) }),
      ...(args.username !== undefined && { username: Like(`%${args.username}%`) }),
    })
  }

  async create({ requestBody }: { requestBody: CreateUserInput }): Promise<UserEntity> {
    const { password, username } = requestBody
    const hashedPassword = encrypt(password)
    const user = this.userRepository.create({ password: hashedPassword, username })
    return this.userRepository.save(user)
  }

  async update({ authorizedUser, input }: { authorizedUser: UserEntity; input: UpdateUserInput }): Promise<UserEntity> {
    if (authorizedUser.id !== input.id) {
      throw new ForbiddenException({ message: "Access denied." })
    }
    const newUserData = { ...(await this.find({ userId: input.id })) }
    if (input.username !== undefined) {
      newUserData.username = input.username
    }
    if (input.password !== undefined && input.password !== "") {
      newUserData.password = encrypt(input.password)
    }
    return this.userRepository.save(newUserData)
  }

  async delete({ userId }: { userId: UserEntity["id"] }): Promise<UserEntity> {
    const user = await this.find({ userId })
    await this.userRepository.delete(userId)
    return user
  }
}

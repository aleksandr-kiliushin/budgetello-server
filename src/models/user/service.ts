import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsRelations, Like, Repository } from "typeorm"

import { encrypt } from "#utils/crypto"

import { IUser } from "#interfaces/user"

import { CreateUserDto } from "./dto/create-user.dto"
import { SearchUsersDto } from "./dto/search-users.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { UserEntity } from "./entities/user.entity"

@Injectable()
export class UserService {
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

  searchUsers({ query }: { query: SearchUsersDto }): Promise<UserEntity[]> {
    return this.userRepository.findBy({
      ...(query.id !== -1 && { id: query.id }),
      ...(query.username !== undefined && { username: Like(`%${query.username}%`) }),
    })
  }

  async create({ requestBody }: { requestBody: CreateUserDto }): Promise<UserEntity> {
    const { password, username } = requestBody
    const hashedPassword = encrypt(password)
    const user = this.userRepository.create({ password: hashedPassword, username })
    return this.userRepository.save(user)
  }

  async update({ requestBody, userId }: { requestBody: UpdateUserDto; userId: UserEntity["id"] }): Promise<UserEntity> {
    const newUserData = { ...(await this.find({ userId })) }
    if (requestBody.username !== undefined) {
      newUserData.username = requestBody.username
    }
    if (requestBody.password !== undefined && requestBody.password !== "") {
      newUserData.password = encrypt(requestBody.password)
    }
    return this.userRepository.save(newUserData)
  }

  async delete({ userId }: { userId: UserEntity["id"] }): Promise<UserEntity> {
    const user = await this.find({ userId })
    await this.userRepository.delete(userId)
    return user
  }
}

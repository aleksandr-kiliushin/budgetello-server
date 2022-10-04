import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsRelations, Like, Repository } from "typeorm"

import { encrypt } from "#utils/crypto"

import { IUser } from "#interfaces/user"

import { CreateUserDto } from "./dto/create-user.dto"
import { FindUsersDto } from "./dto/find-users.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { UserEntity } from "./entities/user.entity"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async findUser(
    params:
      | { authorizedUser?: UserEntity; id: IUser["id"]; relations?: FindOptionsRelations<UserEntity> }
      | { authorizedUser?: UserEntity; username: IUser["username"]; relations?: FindOptionsRelations<UserEntity> }
  ): Promise<UserEntity> {
    let user: UserEntity | null = null

    if ("id" in params && params.id === 0 && params.authorizedUser !== undefined) {
      user = await this.userRepository.findOne({
        where: { id: params.authorizedUser.id },
        ...(params.relations !== undefined && { relations: params.relations }),
      })
    }
    if ("id" in params && params.id !== 0) {
      user = await this.userRepository.findOne({
        where: { id: params.id },
        ...(params.relations !== undefined && { relations: params.relations }),
      })
    }
    if ("username" in params) {
      user = await this.userRepository.findOne({
        where: { username: params.username },
        ...(params.relations !== undefined && { relations: params.relations }),
      })
    }

    if (user === null) throw new NotFoundException({})
    return user
  }

  searchUsers(query: FindUsersDto): Promise<UserEntity[]> {
    const { id, username } = query
    return this.userRepository.findBy({
      ...(id === undefined ? {} : { id: parseInt(id) }),
      ...(username === undefined ? {} : { username: Like(`%${username}%`) }),
    })
  }

  async create(createUserInput: CreateUserDto): Promise<UserEntity> {
    const { password, username } = createUserInput
    const hashedPassword = encrypt(password)
    const user = this.userRepository.create({ password: hashedPassword, username })
    return this.userRepository.save(user)
  }

  async update(id: UserEntity["id"], updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const { password, username } = updateUserDto
    const newUserData = { ...(await this.findUser({ id })) }
    if (username !== undefined) {
      newUserData.username = username
    }
    if (password !== undefined && password !== "") {
      newUserData.password = encrypt(password)
    }
    return this.userRepository.save(newUserData)
  }

  async delete(id: UserEntity["id"]): Promise<UserEntity> {
    const user = await this.findUser({ id })
    await this.userRepository.delete(id)
    return user
  }
}

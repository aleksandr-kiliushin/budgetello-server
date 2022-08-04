import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Like, Repository } from "typeorm"
import * as bcrypt from "bcrypt"

import { UserEntity } from "./entities/user.entity"
import { CreateUserDto } from "./dto/create-user.dto"
import { IUser } from "#interfaces/user"
import { FindUsersDto } from "./dto/find-users.dto"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async findUser(
    params:
      | { loggedInUserId?: IUser["id"]; id: IUser["id"] }
      | { loggedInUserId?: IUser["id"]; username: IUser["username"] }
  ): Promise<UserEntity> {
    let user: UserEntity | null = null

    if ("id" in params && params.id === 0 && params.loggedInUserId !== undefined) {
      user = await this.userRepository.findOneBy({ id: params.loggedInUserId })
    }
    if ("id" in params && params.id !== 0) {
      user = await this.userRepository.findOneBy({ id: params.id })
    }
    if ("username" in params) {
      user = await this.userRepository.findOneBy({ username: params.username })
    }

    if (user === null) throw new NotFoundException({})
    return user
  }

  findUsers(query: FindUsersDto): Promise<UserEntity[]> {
    const { id, username } = query
    return this.userRepository.findBy({
      ...(id === undefined ? {} : { id: parseInt(id) }),
      ...(username === undefined ? {} : { username: Like(`%${username}%`) }),
    })
  }

  async createUser(createUserInput: CreateUserDto): Promise<UserEntity> {
    const { password, username } = createUserInput

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = this.userRepository.create({
      password: hashedPassword,
      username,
    })

    return this.userRepository.save(user)
  }

  // async updateUser(id: UserEntity['id'], updateUserDto: UpdateUserDto): Promise<UserEntity> {
  // 	const { password, username } = updateUserDto
  // 	const user = (await this.getUser({ id })) as UserEntity
  // 	if (username) {
  // 		user.username = username
  // 	}
  // 	if (password) {
  // 		const salt = await bcrypt.genSalt()
  // 		user.password = await bcrypt.hash(password, salt)
  // 	}
  // 	return this.userRepository.save(user)
  // }

  async deleteUser(id: UserEntity["id"]): Promise<UserEntity> {
    // return this.userRepository.delete(id)
    const user = await this.findUser({ id })
    await this.userRepository.delete(id)
    return user
  }
}

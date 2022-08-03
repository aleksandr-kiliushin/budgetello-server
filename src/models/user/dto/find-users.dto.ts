import { IUser } from "#interfaces/user"

export class FindUsersDto {
  id?: string
  username?: IUser["username"]
}

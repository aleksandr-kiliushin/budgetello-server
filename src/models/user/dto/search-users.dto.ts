import { IUser } from "#interfaces/user"

export class SearchUsersDto {
  ids: IUser["id"][]
  username: IUser["username"]
}

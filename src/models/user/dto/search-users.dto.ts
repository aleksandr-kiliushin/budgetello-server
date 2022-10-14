import { IUser } from "#interfaces/user"

export class SearchUsersDto {
  id: IUser["id"]
  username: IUser["username"]
}

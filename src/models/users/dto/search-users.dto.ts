import { IUser } from "#interfaces/user"

export class SearchUsersDto {
  ids?: IUser["id"][] | undefined
  username?: IUser["username"] | undefined
}

import { IActivityCategory } from "#interfaces/activities"
import { IBoard } from "#interfaces/boards"
import { IUser } from "#interfaces/user"

export class SearchActivityCategoriesQueryDto {
  boardsIds?: IBoard["id"][] | undefined
  ids?: IActivityCategory["id"][] | undefined
  ownersIds?: IUser["id"][] | undefined
}

import { IActivityCategory } from "#interfaces/activities"
import { IBoard } from "#interfaces/boards"

export class CreateActivityCategoryDto {
  boardId: IBoard["id"]
  name: IActivityCategory["name"]
  unit: IActivityCategory["unit"]
}

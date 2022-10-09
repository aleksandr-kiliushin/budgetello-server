import { IActivityCategory } from "#interfaces/activities"
import { IBoard } from "#interfaces/boards"

export class CreateActivityCategoryDto {
  boardId: IBoard["id"]
  measurementTypeId: IActivityCategory["measurementType"]["id"]
  name: IActivityCategory["name"]
  unit: IActivityCategory["unit"]
}

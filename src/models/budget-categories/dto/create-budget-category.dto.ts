import { IBoard } from "#interfaces/boards"
import { IBudgetCategory, IBudgetCategoryType } from "#interfaces/budget"

export class CreateBudgetCategoryDto {
  boardId: IBoard["id"]
  name: IBudgetCategory["name"]
  typeId: IBudgetCategoryType["id"]
}

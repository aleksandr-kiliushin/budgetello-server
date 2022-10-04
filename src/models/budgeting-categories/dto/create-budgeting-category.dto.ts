import { IBoard } from "#interfaces/boards"
import { IBudgetingCategory, IBudgetingCategoryType } from "#interfaces/budgeting"

export class CreateBudgetingCategoryDto {
  boardId: IBoard["id"]
  name: IBudgetingCategory["name"]
  typeId: IBudgetingCategoryType["id"]
}

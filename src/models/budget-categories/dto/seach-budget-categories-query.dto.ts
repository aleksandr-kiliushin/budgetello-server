import { IBoard } from "#interfaces/boards"
import { IBudgetCategory } from "#interfaces/budget"

export class SearchBudgetCategoriesQueryDto {
  boardsIds?: IBoard["id"][] | undefined
  ids?: IBudgetCategory["id"][] | undefined
}

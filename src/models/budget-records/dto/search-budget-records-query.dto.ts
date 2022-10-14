import { IBoard } from "#interfaces/boards"
import { IBudgetCategory, IBudgetRecord } from "#interfaces/budget"
import { IOrdering } from "#interfaces/common"

export class SearchBudgetRecordsQueryDto {
  amount?: IBudgetRecord["amount"] | undefined
  boardsIds?: IBoard["id"][] | undefined
  categoriesIds?: IBudgetCategory["id"][] | undefined
  dates?: IBudgetRecord["date"][] | undefined
  ids?: IBudgetRecord["id"][] | undefined
  isTrashed?: IBudgetRecord["isTrashed"] | undefined
  orderingByDate?: IOrdering | undefined
  orderingById?: IOrdering | undefined
  skip?: number | undefined
  take?: number | undefined
}

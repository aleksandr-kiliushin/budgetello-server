import { IBudgetRecord } from "#interfaces/budget"
import { IOrdering } from "#interfaces/common"

export class SearchBudgetRecordsQueryDto {
  amount?: string
  boardId?: string
  categoryId?: string
  date?: IBudgetRecord["date"]
  id?: string
  isTrashed?: "true" | "false"
  orderingByDate?: IOrdering
  orderingById?: IOrdering
  skip?: string
  take?: string
}

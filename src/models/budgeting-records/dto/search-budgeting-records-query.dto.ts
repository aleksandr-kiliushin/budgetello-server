import { IBudgetingRecord } from "#interfaces/budgeting"
import { IOrdering } from "#interfaces/common"

export class SearchBudgetingRecordsQueryDto {
  amount?: string
  boardId?: string
  categoryId?: string
  date?: IBudgetingRecord["date"]
  id?: string
  isTrashed?: "true" | "false"
  orderingByDate?: IOrdering
  orderingById?: IOrdering
  skip?: string
  take?: string
}

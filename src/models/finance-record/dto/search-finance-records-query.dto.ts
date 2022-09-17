import { IOrdering } from "#interfaces/common"
import { IFinanceRecord } from "#interfaces/finance"

export class SearchFinanceRecordsQueryDto {
  amount: string
  date: IFinanceRecord["date"]
  id: string
  isTrashed?: "true" | "false"
  orderingByDate?: IOrdering
  orderingById?: IOrdering
  skip?: string
  take?: string
  categoryId: string
}

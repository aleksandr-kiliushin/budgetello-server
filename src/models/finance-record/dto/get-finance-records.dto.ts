import { IOrdering } from "#interfaces/common"
import { IFinanceRecord } from "#interfaces/finance"

export class GetFinanceRecordsDto {
  isTrashed?: IFinanceRecord["isTrashed"]
  orderingByDate?: IOrdering
  orderingById?: IOrdering
  skip?: number
  take?: number
}

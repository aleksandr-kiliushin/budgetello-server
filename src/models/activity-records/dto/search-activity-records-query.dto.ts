import { IActivityRecord } from "#interfaces/activities"
import { IOrdering } from "#interfaces/common"

export class SearchActivityRecordsQueryDto {
  boardId?: string
  categoryId?: string
  date?: IActivityRecord["date"]
  id?: string
  orderingByDate?: IOrdering
  orderingById?: IOrdering
  skip?: string
  take?: string
}

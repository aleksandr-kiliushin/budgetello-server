import { IActivityCategory, IActivityRecord } from "#interfaces/activities"
import { IBoard } from "#interfaces/boards"
import { IOrdering } from "#interfaces/common"

export class SearchActivityRecordsQueryDto {
  boardsIds?: IBoard["id"][] | undefined
  categorysIds?: IActivityCategory["id"][] | undefined
  dates?: IActivityRecord["date"][] | undefined
  ids?: IActivityRecord["id"][] | undefined
  orderingByDate?: IOrdering | undefined
  orderingById?: IOrdering | undefined
  skip?: number | undefined
  take?: number | undefined
}

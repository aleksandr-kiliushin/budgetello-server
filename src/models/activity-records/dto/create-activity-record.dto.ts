import { IActivityRecord } from "#interfaces/activities"

export class CreateActivityRecordDto {
  booleanValue: IActivityRecord["booleanValue"]
  categoryId: IActivityRecord["category"]["id"]
  comment: IActivityRecord["comment"]
  date: string
  quantitativeValue: IActivityRecord["quantitativeValue"]
}

import { IFinanceCategory, IFinanceCategoryType } from "#interfaces/finance"
import { IGroup } from "#interfaces/groups"

export class CreateFinanceCategoryDto {
  groupId: IGroup["id"]
  name: IFinanceCategory["name"]
  typeId: IFinanceCategoryType["id"]
}

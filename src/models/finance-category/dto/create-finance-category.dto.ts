import { IBoard } from "#interfaces/boards"
import { IFinanceCategory, IFinanceCategoryType } from "#interfaces/finance"

export class CreateFinanceCategoryDto {
  boardId: IBoard["id"]
  name: IFinanceCategory["name"]
  typeId: IFinanceCategoryType["id"]
}

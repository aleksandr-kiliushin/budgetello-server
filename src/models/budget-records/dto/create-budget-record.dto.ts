import { IBudgetCategory, IBudgetRecord } from "#interfaces/budget"

export class CreateBudgetRecordDto {
  amount: IBudgetRecord["amount"]
  categoryId: IBudgetCategory["id"]
  date: IBudgetRecord["date"]
}

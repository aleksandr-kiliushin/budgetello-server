import { IBudgetingCategory, IBudgetingRecord } from "#interfaces/budgeting"

export class CreateBudgetingRecordDto {
  amount: IBudgetingRecord["amount"]
  categoryId: IBudgetingCategory["id"]
  date: IBudgetingRecord["date"]
}

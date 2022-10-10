import { PartialType } from "@nestjs/mapped-types"

import { IBudgetRecord } from "#interfaces/budget"

import { CreateBudgetRecordDto } from "./create-budget-record.dto"

export class UpdateBudgetRecordDto extends PartialType(CreateBudgetRecordDto) {
  isTrashed?: IBudgetRecord["isTrashed"]
}

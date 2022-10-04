import { PartialType } from "@nestjs/mapped-types"

import { IBudgetingRecord } from "#interfaces/budgeting"

import { CreateBudgetingRecordDto } from "./create-budgeting-record.dto"

export class UpdateBudgetingRecordDto extends PartialType(CreateBudgetingRecordDto) {
  isTrashed?: IBudgetingRecord["isTrashed"]
}

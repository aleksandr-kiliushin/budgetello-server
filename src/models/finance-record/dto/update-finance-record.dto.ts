import { PartialType } from "@nestjs/mapped-types"

import { IFinanceRecord } from "#interfaces/finance"

import { CreateFinanceRecordDto } from "./create-finance-record.dto"

export class UpdateFinanceRecordDto extends PartialType(CreateFinanceRecordDto) {
  isTrashed?: IFinanceRecord["isTrashed"]
}

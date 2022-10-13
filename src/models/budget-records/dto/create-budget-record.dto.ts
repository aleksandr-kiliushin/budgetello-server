import { ValidationError } from "#constants/ValidationError"
import { IsDefined, IsInt, IsNotEmpty, IsPositive, IsString, Matches } from "class-validator"

import { IBudgetCategory, IBudgetRecord } from "#interfaces/budget"

export class CreateBudgetRecordDto {
  @IsDefined()
  @IsPositive({ message: "Should be positive." })
  amount: IBudgetRecord["amount"]

  @IsDefined({ message: ValidationError.REQUIRED })
  @IsInt()
  categoryId: IBudgetCategory["id"]

  @IsNotEmpty({ message: ValidationError.REQUIRED })
  @IsString()
  @Matches(/^\d\d\d\d-\d\d-\d\d$/, { message: "Should have format YYYY-MM-DD." })
  date: IBudgetRecord["date"]
}

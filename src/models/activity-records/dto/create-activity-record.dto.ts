import { ValidationError } from "#constants/ValidationError"
import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator"

import { IActivityRecord } from "#interfaces/activities"

export class CreateActivityRecordDto {
  @IsBoolean()
  @IsOptional()
  booleanValue: IActivityRecord["booleanValue"]

  @IsDefined({ message: ValidationError.REQUIRED })
  @IsInt()
  categoryId: IActivityRecord["category"]["id"]

  @IsDefined({ message: ValidationError.REQUIRED })
  @IsString()
  comment: IActivityRecord["comment"]

  @IsNotEmpty({ message: ValidationError.REQUIRED })
  @IsString()
  @Matches(/^\d\d\d\d-\d\d-\d\d$/, { message: "Should have format YYYY-MM-DD." })
  date: string

  @IsNumber()
  @IsOptional()
  quantitativeValue: IActivityRecord["quantitativeValue"]
}

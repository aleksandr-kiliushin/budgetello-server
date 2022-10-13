import { ValidationError } from "#constants/ValidationError"
import { IsDefined, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"

import { IActivityCategory } from "#interfaces/activities"
import { IBoard } from "#interfaces/boards"

export class CreateActivityCategoryDto {
  @IsDefined({ message: ValidationError.REQUIRED })
  @IsInt()
  boardId: IBoard["id"]

  @IsDefined({ message: ValidationError.REQUIRED })
  @IsInt()
  measurementTypeId: IActivityCategory["measurementType"]["id"]

  @IsNotEmpty({ message: ValidationError.REQUIRED })
  @IsString()
  name: IActivityCategory["name"]

  @IsString()
  @IsOptional()
  unit: IActivityCategory["unit"]
}

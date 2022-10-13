import { IsDefined, IsInt, IsNotEmpty, IsString } from "class-validator"
import { ValidationError } from "src/constants/ValidationError"

import { IBoard } from "#interfaces/boards"
import { IBudgetCategory, IBudgetCategoryType } from "#interfaces/budget"

export class CreateBudgetCategoryDto {
  @IsDefined({ message: ValidationError.REQUIRED })
  @IsInt()
  boardId: IBoard["id"]

  @IsNotEmpty({ message: ValidationError.REQUIRED })
  @IsString()
  name: IBudgetCategory["name"]

  @IsDefined({ message: ValidationError.REQUIRED })
  @IsInt()
  typeId: IBudgetCategoryType["id"]
}

import { ValidationError } from "#constants/ValidationError"
import { IsDefined, IsInt, IsNotEmpty, IsString } from "class-validator"

import { BoardEntity } from "#models/boards/entities/board.entity"

export class CreateBoardDto {
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  @IsString()
  name: BoardEntity["name"]

  @IsDefined({ message: ValidationError.REQUIRED })
  @IsInt()
  subjectId: BoardEntity["subject"]["id"]
}

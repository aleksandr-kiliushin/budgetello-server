import { ValidationError } from "#constants/ValidationError"
import { IsNotEmpty, IsString } from "class-validator"

import { IUser } from "#interfaces/user"

export class CreateUserDto {
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  @IsString()
  username: IUser["username"]

  @IsNotEmpty({ message: ValidationError.REQUIRED })
  @IsString()
  password: IUser["password"]
}

/* eslint-disable @typescript-eslint/ban-types */
import { GqlErrorCode } from "#constants/GqlErrorCode"
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"

import { GqlError } from "#helpers/GqlError"

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (metatype === undefined) return value
    if (!this.toValidate(metatype)) return value
    const errors = await validate(plainToInstance(metatype, value))
    if (errors.length === 0) return value

    const responseBody: { fields: Record<string, string> } = { fields: {} }

    errors.forEach((error) => {
      if (error.constraints === undefined) return

      if ("isDefined" in error.constraints) {
        responseBody.fields[error.property] = error.constraints["isDefined"]
        return
      }

      if ("isNotEmpty" in error.constraints) {
        responseBody.fields[error.property] = error.constraints["isNotEmpty"]
        return
      }

      responseBody.fields[error.property] = Object.values(error.constraints)[0]
    })

    throw new GqlError(GqlErrorCode.BAD_REQUEST, responseBody)
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}

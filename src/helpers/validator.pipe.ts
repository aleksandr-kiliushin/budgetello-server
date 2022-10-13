/* eslint-disable @typescript-eslint/ban-types */
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"

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
      const errorText = Object.values(error.constraints)[0]
      responseBody.fields[error.property] = errorText
    })

    throw new BadRequestException(responseBody)
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}

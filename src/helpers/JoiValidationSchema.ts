import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common"
import { ObjectSchema } from "joi"

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const error = this.schema.validate(value).error
    if (error === undefined) return value

    // console.log("value >>", value)
    // console.log("==================================")
    // console.log("error.details >>", error.details)

    const errors: Record<string, Record<string, string>> = { fields: {} }
    error.details.forEach((errorDetail) => {
      const fieldName = errorDetail.path[0]
      errors.fields[fieldName] = errorDetail.message
    })

    throw new BadRequestException(errors)
  }
}

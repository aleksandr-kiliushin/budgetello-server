import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common"

@Injectable()
export class ParseOptionalNumberPipe implements PipeTransform<string, number | undefined> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.data === undefined) return undefined

    const errorResponse = {
      query: {
        [metadata.data]: "Should be a number.",
      },
    }

    if (value === undefined) return undefined
    if (typeof value !== "string") {
      throw new BadRequestException(errorResponse)
    }

    const number = Number(value)
    if (isNaN(number)) {
      throw new BadRequestException(errorResponse)
    }

    return number
  }
}

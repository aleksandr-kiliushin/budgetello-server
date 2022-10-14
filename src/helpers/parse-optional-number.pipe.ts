import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common"

@Injectable()
export class ParseOptionalNumberPipe implements PipeTransform<string, number | undefined> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.data === undefined) return undefined

    if (value === undefined) return undefined

    const number = Number(value)
    if (isNaN(number)) {
      throw new BadRequestException({
        query: {
          [metadata.data]: "Should be a number.",
        },
      })
    }

    return number
  }
}

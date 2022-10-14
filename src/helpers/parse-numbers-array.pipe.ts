import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common"

@Injectable()
export class ParseNumbersArrayPipe implements PipeTransform<string, number[] | undefined> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.data === undefined) return undefined

    if (value === undefined) return undefined

    const numbers = value.split(",").map(Number)
    if (numbers.some((number) => isNaN(number))) {
      throw new BadRequestException({
        query: {
          [metadata.data]: "An array of numbers expected.",
        },
      })
    }

    return numbers
  }
}

import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common"

@Injectable()
export class ParseNumbersArrayPipe implements PipeTransform<string, number[] | undefined> {
  transform(value: string, metadata: ArgumentMetadata) {
    // console.log("metadata >>", metadata)

    if (value === undefined) return undefined
    if (typeof value !== "string") {
      throw new BadRequestException({ message: "An array of numbers expected." })
    }

    const numbers = value.split(",").map(Number)
    if (numbers.some((number) => isNaN(number))) {
      throw new BadRequestException({ message: "An array of numbers expected." })
    }

    return numbers
  }
}

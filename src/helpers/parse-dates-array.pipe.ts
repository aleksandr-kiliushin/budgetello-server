import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common"

@Injectable()
export class ParseDatesArrayPipe implements PipeTransform<string, string[] | undefined> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.data === undefined) return undefined

    const errorResponse = {
      query: {
        [metadata.data]: "An array of YYYY-MM-DD dates expected.",
      },
    }

    if (value === undefined) return undefined
    if (typeof value !== "string") {
      throw new BadRequestException(errorResponse)
    }

    const dates = value.split(",")
    if (dates.some((date) => !/\d\d\d\d-\d\d-\d\d/.test(date))) {
      throw new BadRequestException(errorResponse)
    }

    return dates
  }
}

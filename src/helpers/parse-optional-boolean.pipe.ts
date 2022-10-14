import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common"

@Injectable()
export class ParseOptionalBooleanPipe implements PipeTransform<string, boolean | undefined> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.data === undefined) return undefined
    if (value === undefined) return undefined
    if (value == "true") return true
    if (value == "false") return false

    throw new BadRequestException({
      query: {
        [metadata.data]: "Should be a boolean.",
      },
    })
  }
}

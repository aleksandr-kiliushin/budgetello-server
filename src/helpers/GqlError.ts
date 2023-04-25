import { GqlErrorCode } from "#constants/GqlErrorCode"
import { ApolloError } from "apollo-server-express"

export class GqlError extends ApolloError {
  constructor(errorCode: GqlErrorCode, errorBody: Record<string, unknown>) {
    super("", errorCode, { exception: { response: errorBody } })
  }
}

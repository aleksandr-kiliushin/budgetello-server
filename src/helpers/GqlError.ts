import { ApolloError } from "apollo-server-express"

import { GqlErrorCode } from "#constants"

export class GqlError extends ApolloError {
  constructor(errorCode: GqlErrorCode, errorBody: Record<string, unknown>) {
    super("", errorCode, { exception: { response: errorBody } })
  }
}

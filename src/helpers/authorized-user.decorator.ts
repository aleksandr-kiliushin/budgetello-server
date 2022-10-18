import { ExecutionContext, createParamDecorator } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"

export const AuthorizedUser = createParamDecorator((data: unknown, executionContext: ExecutionContext) => {
  return GqlExecutionContext.create(executionContext).getContext().authorizedUser
})

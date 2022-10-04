import { ExecutionContext, createParamDecorator } from "@nestjs/common"

export const AuthorizedUserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.authorizedUserId
})

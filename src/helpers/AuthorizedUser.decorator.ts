import { ExecutionContext, createParamDecorator } from "@nestjs/common"

export const AuthorizedUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().authorizedUser
})

let authorizationToken = ""

export const getAuthorizationToken = () => {
  return authorizationToken
}

export const setAuthorizationToken = (newAuthorizationToken: string) => {
  authorizationToken = newAuthorizationToken
}

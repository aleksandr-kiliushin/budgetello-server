import { users } from "../constants/users"
import { fetchGqlApi } from "./fetchGqlApi"

type ITestUser = typeof users[keyof typeof users]

export type ITestUserId = ITestUser["id"]

const credentialsByTestUserId: Record<ITestUserId, { password: string; username: ITestUser["username"] }> = {
  "1": {
    username: "john-doe",
    password: "john-doe-password",
  },
  "2": {
    username: "jessica-stark",
    password: "jessica-stark-password",
  },
}

export const authorize = async (testUserId: ITestUserId): Promise<void> => {
  const testUserCredentials = credentialsByTestUserId[testUserId]
  const authorizationResponseBody = await fetchGqlApi(`mutation AUTHORIZE {
    authorize(input: { username: "${testUserCredentials.username}", password: "${testUserCredentials.password}" })
  }`)
  const authorizationToken = authorizationResponseBody.data.authorize
  if (typeof authorizationToken !== "string") {
    throw new Error(`Authorization failed for the following credentials.
Username: [${testUserCredentials.username}], password: [${testUserCredentials.password}].
`)
  }
  globalThis.authorizationToken = authorizationToken
}

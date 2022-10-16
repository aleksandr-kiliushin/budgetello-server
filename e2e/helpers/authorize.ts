import { users } from "../constants/users"
import { fetchGqlApi } from "./fetchGqlApi"

type ITestUser = typeof users[keyof typeof users]

export type ITestUserId = ITestUser["id"]

const credentialsByTestUserId: Record<ITestUserId, { password: string; username: ITestUser["username"] }> = {
  "1": {
    password: "john-doe-password",
    username: "john-doe",
  },
  "2": {
    password: "jessica-stark-password",
    username: "jessica-stark",
  },
}

export const authorize = async (testUserId: ITestUserId): Promise<void> => {
  const testUserCredentials = credentialsByTestUserId[testUserId]
  const authorizeResponseBody = await fetchGqlApi(`mutation AUTHORIZE {
    authorize(input: { username: "${testUserCredentials.username}", password: "${testUserCredentials.password}" }) {
      authToken
    }
  }`)
  if (typeof authorizeResponseBody.authToken !== "string") {
    throw new Error(`Authorization failed for the following credentials.
Username: [${testUserCredentials.username}], password: [${testUserCredentials.password}].
`)
  }
  globalThis.authToken = authToken
}

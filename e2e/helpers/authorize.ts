import { users } from "../constants/users"
import { fetchGqlApi } from "./fetchGqlApi"

export type ITestUser = typeof users[keyof typeof users]

export const authorize = async (testUser: ITestUser): Promise<void> => {
  const authorizeResponseBody = await fetchGqlApi(`mutation AUTHORIZE {
    authorize(input: { username: "${testUser.username}", password: "${testUser.password}" }) {
      authToken
    }
  }`)
  if (typeof authorizeResponseBody.authToken !== "string") {
    throw new Error(`Authorization failed for the following credentials.
Username: [${testUser.username}], password: [${testUser.password}].
`)
  }
  globalThis.authToken = authToken
}

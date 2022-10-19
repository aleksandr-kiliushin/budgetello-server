import { users } from "../constants/users"
import { setAuthorizationToken } from "./authorization-token"

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
  const authorizationResponse = await fetch("http://localhost:3080/graphql", {
    body: JSON.stringify({
      query: `mutation AUTHORIZE {
        authorize(input: { username: "${testUserCredentials.username}", password: "${testUserCredentials.password}" })
      }`,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  })
  const authorizationResponseBody = await authorizationResponse.json()
  const authorizationToken = authorizationResponseBody.data.authorize
  if (typeof authorizationToken !== "string") {
    throw new Error(`Authorization failed for the following credentials.
Username: [${testUserCredentials.username}], password: [${testUserCredentials.password}].
`)
  }
  setAuthorizationToken(authorizationToken)
}

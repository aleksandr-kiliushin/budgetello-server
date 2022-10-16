import { fetchGqlApi } from "./fetchGqlApi"

const passwordByUsername = {
  "john-doe": "john-doe-password",
  "jessica-stark": "jessica-stark-password",
}

export type ITestUserUsername = keyof typeof passwordByUsername

export const authorize = async (username: ITestUserUsername): Promise<void> => {
  const password = passwordByUsername[username]
  const authorizeResponseBody = await fetchGqlApi(`mutation AUTHORIZE {
    authorize(input: { username: "${username}", password: "${password}" }) {
      authToken
    }
  }`)
  if (typeof authorizeResponseBody.authToken !== "string") {
    throw new Error(`Authorization failed for the following credentials.
Username: [${username}], password: [${password}].
`)
  }
  globalThis.authToken = authToken
}

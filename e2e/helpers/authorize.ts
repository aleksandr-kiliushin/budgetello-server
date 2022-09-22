const passwordByUsername = {
  "john-doe": "john-doe-password",
  "jessica-stark": "jessica-stark-password",
}

export type ITestUserUsername = keyof typeof passwordByUsername

export const authorize = async (username: ITestUserUsername): Promise<void> => {
  const password = passwordByUsername[username]
  const authorizationResponse = await fetch("http://localhost:3080/api/login", {
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })
  const { authToken } = await authorizationResponse.json()
  if (typeof authToken !== "string") {
    throw new Error(`Authorization failed for the following credentials.
Username: [${username}], password: [${password}].
Response status: ${authorizationResponse.status}
`)
  }
  globalThis.authToken = authToken
}

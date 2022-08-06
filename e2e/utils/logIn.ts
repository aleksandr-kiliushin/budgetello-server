import { IUser } from "../../src/interfaces/user"

export const logIn = async ({
  username,
  password,
}: {
  username: IUser["username"]
  password: IUser["password"]
}): Promise<string> => {
  const loginResponse = await fetch("http://localhost:3080/api/login", {
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })
  return (await loginResponse.json()).authToken
}

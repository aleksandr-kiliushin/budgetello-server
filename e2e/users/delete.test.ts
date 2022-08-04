import { IUser } from "../../src/interfaces/user"

const logIn = async ({}: { username: IUser["username"]; password: IUser["password"] }): Promise<string> => {
  const loginResponse = await fetch("http://localhost:3080/api/login", {
    body: JSON.stringify({
      username: "john-doe",
      password: "john-doe-password",
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
  const loginResponseData = await loginResponse.json()
  return loginResponseData.authToken
}

describe("User deletion", () => {
  it("doesn't allow delete another user", async () => {
    const authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
    const deleteAnotherUserResponse = await fetch("http://localhost:3080/api/users/2", {
      headers: {
        Authorization: "Bearer " + authToken,
      },
      method: "DELETE",
    })
    expect(deleteAnotherUserResponse.status).toEqual(403)
    expect(await deleteAnotherUserResponse.json()).toEqual({ message: "You are not allowed to delete another user." })
    const fetchAnotherUserResponse = await fetch("http://localhost:3080/api/users/2", {
      headers: {
        Authorization: "Bearer " + authToken,
      },
    })
    expect(fetchAnotherUserResponse.status).toEqual(200)
    expect(await fetchAnotherUserResponse.json()).toEqual<IUser>({
      id: 2,
      username: "jessica-stark",
      password: "$2b$10$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC",
    })
  })
})

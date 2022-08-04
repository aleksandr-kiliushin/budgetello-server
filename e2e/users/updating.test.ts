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

describe("User updating", () => {
  it("doesn't allow update another user", async () => {
    const authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
    const updateAnotherUserResponse = await fetch("http://localhost:3080/api/users/2", {
      body: JSON.stringify({ username: "jessica-stark-is-stupid" }),
      headers: {
        Authorization: "Bearer " + authToken,
        // "Content-Type": "application/json",
      },
      method: "PATCH",
    })
    expect(updateAnotherUserResponse.status).toEqual(403)
    expect(await updateAnotherUserResponse.json()).toEqual({ message: "You are not allowed to update another user." })
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

  // it("allows the logged in user to delete themselves", async () => {
  //   const userToBeDeletedAuthToken = await logIn({ username: "john-doe", password: "john-doe-password" })
  //   const deleteMeResponse = await fetch("http://localhost:3080/api/users/1", {
  //     headers: {
  //       Authorization: "Bearer " + userToBeDeletedAuthToken,
  //     },
  //     method: "DELETE",
  //   })
  //   expect(deleteMeResponse.status).toEqual(200)
  //   expect(await deleteMeResponse.json()).toEqual<IUser>({
  //     id: 1,
  //     username: "john-doe",
  //     password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i",
  //   })
  // })

  // it("the deleted user doesn't exist in all users list", async () => {
  //   const userToBeDeletedAuthToken = await logIn({ username: "john-doe", password: "john-doe-password" })
  //   await fetch("http://localhost:3080/api/users/1", {
  //     headers: {
  //       Authorization: "Bearer " + userToBeDeletedAuthToken,
  //     },
  //     method: "DELETE",
  //   })
  //   const anotherUserAuthToken = await logIn({ username: "jessica-stark", password: "jessica-stark-password" })
  //   const fetchAllUsersResponse = await fetch("http://localhost:3080/api/users/search", {
  //     headers: {
  //       Authorization: "Bearer " + anotherUserAuthToken,
  //     },
  //   })
  //   expect(await fetchAllUsersResponse.json()).not.toContainEqual<IUser>({
  //     id: 1,
  //     username: "john-doe",
  //     password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i",
  //   })
  // })
})

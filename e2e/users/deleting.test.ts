import { IUser } from "../../src/interfaces/user"
import { logIn } from "../utils/logIn"

describe("User deletion", () => {
  it("doesn't allow delete another user", async () => {
    const authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
    const deleteAnotherUserResponse = await fetch("http://localhost:3080/api/users/2", {
      headers: { Authorization: authToken },
      method: "DELETE",
    })
    expect(deleteAnotherUserResponse.status).toEqual(403)
    expect(await deleteAnotherUserResponse.json()).toEqual({ message: "You are not allowed to delete another user." })
    const fetchAnotherUserResponse = await fetch("http://localhost:3080/api/users/2", {
      headers: { Authorization: authToken },
    })
    expect(fetchAnotherUserResponse.status).toEqual(200)
    expect(await fetchAnotherUserResponse.json()).toEqual<IUser>({
      id: 2,
      username: "jessica-stark",
      password: "$2b$10$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC",
    })
  })

  it("allows the logged in user to delete themselves", async () => {
    const userToBeDeletedAuthToken = await logIn({ username: "john-doe", password: "john-doe-password" })
    const deleteMeResponse = await fetch("http://localhost:3080/api/users/1", {
      headers: { Authorization: userToBeDeletedAuthToken },
      method: "DELETE",
    })
    expect(deleteMeResponse.status).toEqual(200)
    expect(await deleteMeResponse.json()).toEqual<IUser>({
      id: 1,
      username: "john-doe",
      password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i",
    })
  })

  it("the deleted user doesn't exist in all users list", async () => {
    const userToBeDeletedAuthToken = await logIn({ username: "john-doe", password: "john-doe-password" })
    await fetch("http://localhost:3080/api/users/1", {
      headers: { Authorization: userToBeDeletedAuthToken },
      method: "DELETE",
    })
    const anotherUserAuthToken = await logIn({ username: "jessica-stark", password: "jessica-stark-password" })
    const fetchAllUsersResponse = await fetch("http://localhost:3080/api/users/search", {
      headers: { Authorization: anotherUserAuthToken },
    })
    expect(await fetchAllUsersResponse.json()).toEqual<IUser[]>([
      { id: 2, username: "jessica-stark", password: "$2b$10$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC" },
    ])
  })
})

import { IUser } from "../../src/interfaces/user"
import { authorize } from "../helpers/authorize"
import { fetchApi } from "../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("User deletion", () => {
  it("doesn't allow delete another user", async () => {
    const deleteAnotherUserResponse = await fetchApi("/api/users/2", { method: "DELETE" })
    expect(deleteAnotherUserResponse.status).toEqual(403)
    expect(await deleteAnotherUserResponse.json()).toEqual({ message: "You are not allowed to delete another user." })
    const fetchAnotherUserResponse = await fetchApi("/api/users/2")
    expect(fetchAnotherUserResponse.status).toEqual(200)
    expect(await fetchAnotherUserResponse.json()).toEqual<IUser>({
      id: 2,
      username: "jessica-stark",
      password: "$2b$10$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC",
    })
  })

  it("allows the logged in user to delete themselves", async () => {
    const deleteMeResponse = await fetchApi("/api/users/1", { method: "DELETE" })
    expect(deleteMeResponse.status).toEqual(200)
    expect(await deleteMeResponse.json()).toEqual<IUser>({
      id: 1,
      username: "john-doe",
      password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i",
    })
  })

  it("the deleted user doesn't exist in all users list", async () => {
    await fetchApi("/api/users/1", { method: "DELETE" })
    await authorize("jessica-stark")
    const fetchAllUsersResponse = await fetchApi("/api/users/search")
    expect(await fetchAllUsersResponse.json()).toEqual<IUser[]>([
      { id: 2, username: "jessica-stark", password: "$2b$10$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC" },
    ])
  })
})

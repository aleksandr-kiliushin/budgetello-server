import { IUser } from "#interfaces/user"

import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("User deletion", () => {
  it("doesn't allow delete another user", async () => {
    const deleteAnotherUserResponse = await fetchApi(`/api/users/${users.jessicaStark.id}`, { method: "DELETE" })
    expect(deleteAnotherUserResponse.status).toEqual(403)
    expect(await deleteAnotherUserResponse.json()).toEqual({ message: "You are not allowed to delete another user." })
    const fetchAnotherUserResponse = await fetchApi(`/api/users/${users.jessicaStark.id}`)
    expect(fetchAnotherUserResponse.status).toEqual(200)
    expect(await fetchAnotherUserResponse.json()).toEqual<IUser>(users.jessicaStark)
  })

  it("allows the logged in user to delete themselves", async () => {
    const deleteMeResponse = await fetchApi(`/api/users/${users.johnDoe.id}`, { method: "DELETE" })
    expect(deleteMeResponse.status).toEqual(200)
    expect(await deleteMeResponse.json()).toEqual<IUser>(users.johnDoe)
  })

  it("the deleted user doesn't exist in all users list", async () => {
    await fetchApi(`/api/users/${users.johnDoe.id}`, { method: "DELETE" })
    await authorize(users.jessicaStark.username)
    const fetchAllUsersResponse = await fetchApi("/api/users/search")
    expect(await fetchAllUsersResponse.json()).toEqual<IUser[]>([users.jessicaStark])
  })
})

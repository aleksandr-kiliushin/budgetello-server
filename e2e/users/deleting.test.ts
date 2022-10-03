import { IUser } from "#interfaces/user"

import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

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
      password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183",
    })
  })

  it("allows the logged in user to delete themselves", async () => {
    const deleteMeResponse = await fetchApi("/api/users/1", { method: "DELETE" })
    expect(deleteMeResponse.status).toEqual(200)
    expect(await deleteMeResponse.json()).toEqual<IUser>({
      id: 1,
      username: "john-doe",
      password: "8bd309ffba83c3db9a53142b052468007b",
    })
  })

  it("the deleted user doesn't exist in all users list", async () => {
    await fetchApi("/api/users/1", { method: "DELETE" })
    await authorize("jessica-stark")
    const fetchAllUsersResponse = await fetchApi("/api/users/search")
    expect(await fetchAllUsersResponse.json()).toEqual<IUser[]>([
      {
        id: 2,
        username: "jessica-stark",
        password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183",
      },
    ])
  })
})

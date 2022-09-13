import { IUser } from "../../src/interfaces/user"
import { authorize } from "../helpers/authorize"
import { fetchApi } from "../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("User updating", () => {
  it("doesn't allow update another user", async () => {
    const updateAnotherUserResponse = await fetchApi("/api/users/2", {
      body: JSON.stringify({ username: "jessica-stark-is-stupid" }),
      method: "PATCH",
    })
    expect(updateAnotherUserResponse.status).toEqual(403)
    expect(await updateAnotherUserResponse.json()).toEqual({ message: "You are not allowed to update another user." })
    const fetchAnotherUserResponse = await fetchApi("/api/users/2")
    expect(fetchAnotherUserResponse.status).toEqual(200)
    expect(await fetchAnotherUserResponse.json()).toEqual<IUser>({
      id: 2,
      username: "jessica-stark",
      password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183",
    })
  })

  it("allows the logged in user to update themselves", async () => {
    const updateMeResponse = await fetchApi("/api/users/1", {
      body: JSON.stringify({ username: "john-doe-is-cool", password: "john-doe-new-password" }),
      method: "PATCH",
    })
    expect(updateMeResponse.status).toEqual(200)
    expect(await updateMeResponse.json()).toEqual<IUser>({
      id: 1,
      username: "john-doe-is-cool",
      password: expect.stringMatching(".+"),
    })
  })

  it("user cannot login with the old credentials", async () => {
    await fetchApi("/api/users/1", {
      body: JSON.stringify({ username: "john-doe-is-cool", password: "john-doe-new-password" }),
      method: "PATCH",
    })
    const loginWithTheOldCredentialsResponse = await fetch("http://localhost:3080/api/login", {
      body: JSON.stringify({ username: "john-doe", password: "john-doe-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    expect(loginWithTheOldCredentialsResponse.status).toEqual(400)
    expect(await loginWithTheOldCredentialsResponse.json()).toEqual({ fields: { username: "User not found." } })
  })

  it("user can login with the new credentials", async () => {
    await fetchApi("/api/users/1", {
      body: JSON.stringify({ username: "john-doe-is-cool", password: "john-doe-new-password" }),
      method: "PATCH",
    })
    const loginWithTheNewCredentialsResponse = await fetch("http://localhost:3080/api/login", {
      body: JSON.stringify({ username: "john-doe-is-cool", password: "john-doe-new-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    expect(loginWithTheNewCredentialsResponse.status).toEqual(201)
    expect(await loginWithTheNewCredentialsResponse.json()).toEqual({
      authToken: expect.stringMatching(".+"),
    })
  })

  it("all users list is updated after a user is updated", async () => {
    const updateMeResponse = await fetchApi("/api/users/1", {
      body: JSON.stringify({ username: "john-doe-is-cool", password: "john-doe-new-password" }),
      method: "PATCH",
    })
    const loginWithTheNewCredentialsResponse = await fetch("http://localhost:3080/api/login", {
      body: JSON.stringify({ username: "john-doe-is-cool", password: "john-doe-new-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    const fetchAllUsersResponse = await fetch("http://localhost:3080/api/users/search", {
      headers: { Authorization: (await loginWithTheNewCredentialsResponse.json()).authToken },
    })
    expect(fetchAllUsersResponse.status).toEqual(200)
    const allUsers = await fetchAllUsersResponse.json()
    expect(allUsers).toHaveLength(2)
    expect(allUsers).toContainEqual({
      id: 1,
      username: "john-doe-is-cool",
      password: (await updateMeResponse.json()).password,
    })
    expect(allUsers).toContainEqual({
      id: 2,
      username: "jessica-stark",
      password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183",
    })
  })
})

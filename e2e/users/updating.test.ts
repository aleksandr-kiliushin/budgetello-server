import { IUser } from "#interfaces/user"

import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("User updating", () => {
  it("doesn't allow update another user", async () => {
    const updateAnotherUserResponse = await fetchApi(`/api/users/${users.jessicaStark.id}`, {
      body: JSON.stringify({ username: "jessica-stark-is-stupid" }),
      method: "PATCH",
    })
    expect(updateAnotherUserResponse.status).toEqual(403)
    expect(await updateAnotherUserResponse.json()).toEqual({ message: "You are not allowed to update another user." })
    const fetchAnotherUserResponse = await fetchApi(`/api/users/${users.jessicaStark.id}`)
    expect(fetchAnotherUserResponse.status).toEqual(200)
    expect(await fetchAnotherUserResponse.json()).toEqual<IUser>(users.jessicaStark)
  })

  it("allows the logged in user to update themselves", async () => {
    const updateMeResponse = await fetchApi(`/api/users/${users.johnDoe.id}`, {
      body: JSON.stringify({ username: "john-doe-is-cool", password: "john-doe-new-password" }),
      method: "PATCH",
    })
    expect(updateMeResponse.status).toEqual(200)
    expect(await updateMeResponse.json()).toEqual<IUser>({
      id: users.johnDoe.id,
      username: "john-doe-is-cool",
      password: expect.stringMatching(".+"),
    })
  })

  it("user cannot auth with the old credentials", async () => {
    await fetchApi(`/api/users/${users.johnDoe.id}`, {
      body: JSON.stringify({ username: "john-doe-is-cool", password: "john-doe-new-password" }),
      method: "PATCH",
    })
    const authWithTheOldCredentialsResponse = await fetch("http://localhost:3080/api/auth", {
      body: JSON.stringify({ username: "john-doe", password: "john-doe-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    expect(authWithTheOldCredentialsResponse.status).toEqual(400)
    expect(await authWithTheOldCredentialsResponse.json()).toEqual({ fields: { username: "User not found." } })
  })

  it("user can auth with the new credentials", async () => {
    await fetchApi(`/api/users/${users.johnDoe.id}`, {
      body: JSON.stringify({ username: "john-doe-is-cool", password: "john-doe-new-password" }),
      method: "PATCH",
    })
    const authWithTheNewCredentialsResponse = await fetch("http://localhost:3080/api/auth", {
      body: JSON.stringify({ username: "john-doe-is-cool", password: "john-doe-new-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    expect(authWithTheNewCredentialsResponse.status).toEqual(201)
    expect(await authWithTheNewCredentialsResponse.json()).toEqual({
      authToken: expect.stringMatching(".+"),
    })
  })

  it("all users list is updated after a user is updated", async () => {
    const updateMeResponse = await fetchApi(`/api/users/${users.johnDoe.id}`, {
      body: JSON.stringify({ username: "john-doe-is-cool", password: "john-doe-new-password" }),
      method: "PATCH",
    })
    const authWithTheNewCredentialsResponse = await fetch("http://localhost:3080/api/auth", {
      body: JSON.stringify({ username: "john-doe-is-cool", password: "john-doe-new-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    const fetchAllUsersResponse = await fetch("http://localhost:3080/api/users/search", {
      headers: { Authorization: (await authWithTheNewCredentialsResponse.json()).authToken },
    })
    expect(fetchAllUsersResponse.status).toEqual(200)
    const allUsers = await fetchAllUsersResponse.json()
    expect(allUsers).toHaveLength(2)
    expect(allUsers).toContainEqual({
      id: users.johnDoe.id,
      username: "john-doe-is-cool",
      password: (await updateMeResponse.json()).password,
    })
    expect(allUsers).toContainEqual(users.jessicaStark)
  })
})

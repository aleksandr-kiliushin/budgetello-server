import { IUser } from "../../src/interfaces/user"

const logIn = async ({
  username,
  password,
}: {
  username: IUser["username"]
  password: IUser["password"]
}): Promise<string> => {
  const loginResponse = await fetch("http://localhost:3080/api/login", {
    body: JSON.stringify({ username, password }),
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
        "Content-Type": "application/json",
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

  it("allows the logged in user to update themselves", async () => {
    const userToBeUpdatedAuthToken = await logIn({ username: "john-doe", password: "john-doe-password" })
    const updateMeResponse = await fetch("http://localhost:3080/api/users/1", {
      body: JSON.stringify({
        username: "john-doe-is-cool",
        password: "john-doe-new-password",
      }),
      headers: {
        Authorization: "Bearer " + userToBeUpdatedAuthToken,
        "Content-Type": "application/json",
      },
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
    const userToBeUpdatedAuthToken = await logIn({ username: "john-doe", password: "john-doe-password" })
    await fetch("http://localhost:3080/api/users/1", {
      body: JSON.stringify({
        username: "john-doe-is-cool",
        password: "john-doe-new-password",
      }),
      headers: {
        Authorization: "Bearer " + userToBeUpdatedAuthToken,
        "Content-Type": "application/json",
      },
      method: "PATCH",
    })
    const loginWithTheOldCredentialsResponse = await fetch("http://localhost:3080/api/login", {
      body: JSON.stringify({
        username: "john-doe",
        password: "john-doe-password",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
    expect(loginWithTheOldCredentialsResponse.status).toEqual(404)
    expect(await loginWithTheOldCredentialsResponse.json()).toEqual({})
  })

  it("user can login with the new credentials", async () => {
    const userToBeUpdatedAuthToken = await logIn({ username: "john-doe", password: "john-doe-password" })
    await fetch("http://localhost:3080/api/users/1", {
      body: JSON.stringify({
        username: "john-doe-is-cool",
        password: "john-doe-new-password",
      }),
      headers: {
        Authorization: "Bearer " + userToBeUpdatedAuthToken,
        "Content-Type": "application/json",
      },
      method: "PATCH",
    })
    const loginWithTheNewCredentialsResponse = await fetch("http://localhost:3080/api/login", {
      body: JSON.stringify({
        username: "john-doe-is-cool",
        password: "john-doe-new-password",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
    expect(loginWithTheNewCredentialsResponse.status).toEqual(201)
    expect(await loginWithTheNewCredentialsResponse.json()).toEqual({
      authToken: expect.stringMatching(".+"),
    })
  })

  it("all users list is updated after a user is updated", async () => {
    const userToBeUpdatedAuthToken = await logIn({ username: "john-doe", password: "john-doe-password" })
    const updateMeResponse = await fetch("http://localhost:3080/api/users/1", {
      body: JSON.stringify({
        username: "john-doe-is-cool",
        password: "john-doe-new-password",
      }),
      headers: {
        Authorization: "Bearer " + userToBeUpdatedAuthToken,
        "Content-Type": "application/json",
      },
      method: "PATCH",
    })
    const loginWithTheNewCredentialsAuthToken = await logIn({
      username: "john-doe-is-cool",
      password: "john-doe-new-password",
    })
    const fetchAllUsersResponse = await fetch("http://localhost:3080/api/users/search", {
      headers: {
        Authorization: "Bearer " + loginWithTheNewCredentialsAuthToken,
      },
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
      password: "$2b$10$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC",
    })
  })
})

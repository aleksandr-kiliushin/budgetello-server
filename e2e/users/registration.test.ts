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
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })
  const { authToken } = await loginResponse.json()
  return authToken
}

describe("User registration", () => {
  it("db initially has only 2 users prefilled users", async () => {
    const someExistingUserAuthToken = await logIn({ username: "john-doe", password: "john-doe-password" })
    const allUsersResponse = await fetch("http://localhost:3080/api/users/search", {
      headers: {
        Authorization: "Bearer " + someExistingUserAuthToken,
      },
    })
    expect(await allUsersResponse.json()).toEqual<IUser[]>([
      { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
      { id: 2, username: "jessica-stark", password: "$2b$10$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC" },
    ])
  })

  it("responds with correct data after registration", async () => {
    const registerUserResponse = await fetch("http://localhost:3080/api/users", {
      body: JSON.stringify({ username: "andrew-smith", password: "andrew-smith-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    expect(registerUserResponse.status).toEqual(201)
    expect(await registerUserResponse.json()).toEqual<IUser>({
      id: 3,
      password: expect.stringMatching(".+"),
      username: "andrew-smith",
    })
  })

  it("a newly registered user can log in and request their data", async () => {
    const registerUserResponse = await fetch("http://localhost:3080/api/users", {
      body: JSON.stringify({ username: "andrew-smith", password: "andrew-smith-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    const newlyRegisteredUserHashedPassword = (await registerUserResponse.json()).password
    const newlyRegisteredUserAuthToken = await logIn({ username: "andrew-smith", password: "andrew-smith-password" })
    const getLoggedInUserDataResponse = await fetch("http://localhost:3080/api/users/0", {
      headers: {
        Authorization: "Bearer " + newlyRegisteredUserAuthToken,
      },
    })
    expect(getLoggedInUserDataResponse.status).toEqual(200)
    expect(await getLoggedInUserDataResponse.json()).toEqual<IUser>({
      id: 3,
      username: "andrew-smith",
      password: newlyRegisteredUserHashedPassword,
    })
  })

  it("finds newly registered user by id", async () => {
    const registerUserResponse = await fetch("http://localhost:3080/api/users", {
      body: JSON.stringify({ username: "andrew-smith", password: "andrew-smith-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    const newlyRegisteredUserHashedPassword = (await registerUserResponse.json()).password
    const newlyRegisteredUserAuthToken = await logIn({ username: "andrew-smith", password: "andrew-smith-password" })
    const findNewlyRegisteredUserByIdResponse = await fetch("http://localhost:3080/api/users/3", {
      headers: {
        Authorization: "Bearer " + newlyRegisteredUserAuthToken,
      },
    })
    expect(findNewlyRegisteredUserByIdResponse.status).toEqual(200)
    expect(await findNewlyRegisteredUserByIdResponse.json()).toEqual<IUser>({
      id: 3,
      username: "andrew-smith",
      password: newlyRegisteredUserHashedPassword,
    })
  })

  it("all users list has newly registered user", async () => {
    const registerUserResponse = await fetch("http://localhost:3080/api/users", {
      body: JSON.stringify({ username: "andrew-smith", password: "andrew-smith-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    const newlyRegisteredUserHashedPassword = (await registerUserResponse.json()).password
    const newlyRegisteredUserAuthToken = await logIn({ username: "andrew-smith", password: "andrew-smith-password" })
    const allUsersResponse = await fetch("http://localhost:3080/api/users/search", {
      headers: {
        Authorization: "Bearer " + newlyRegisteredUserAuthToken,
      },
    })
    expect(await allUsersResponse.json()).toEqual<IUser[]>([
      { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
      { id: 2, username: "jessica-stark", password: "$2b$10$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC" },
      { id: 3, username: "andrew-smith", password: newlyRegisteredUserHashedPassword },
    ])
  })
})

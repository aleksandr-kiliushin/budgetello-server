import { IUser } from "../../src/interfaces/user"

describe("User registration process", () => {
  it("can register and get correct data response after registration", async () => {
    const registerUserResponse = await fetch("http://localhost:3080/api/users", {
      body: JSON.stringify({ username: "andrew-smith", password: "andrew-smith-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })

    expect(await registerUserResponse.json()).toEqual<IUser>({
      id: 3,
      password: expect.stringMatching(".+"),
      username: "andrew-smith",
    })
  })
})

describe("Registered user data and functions", () => {
  let newlyRegisteredUser = {
    id: 0,
    username: "",
    password: "",
    hashedPassword: "",
    authToken: "",
  }

  beforeEach(async () => {
    const registerUserResponse = await fetch("http://localhost:3080/api/users", {
      body: JSON.stringify({ username: "andrew-smith", password: "andrew-smith-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    const registerUserResponseData = await registerUserResponse.json()

    const newlyRegisteredUserLoginResponse = await fetch("http://localhost:3080/api/login", {
      body: JSON.stringify({
        username: "andrew-smith",
        password: "andrew-smith-password",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
    const { authToken } = await newlyRegisteredUserLoginResponse.json()

    newlyRegisteredUser = {
      id: registerUserResponseData.id,
      username: registerUserResponseData.username,
      password: "andrew-smith-password",
      hashedPassword: registerUserResponseData.password,
      authToken,
    }
  })

  it("a newly registered request their data", async () => {
    const getLoggedInUserDataResponse = await fetch("http://localhost:3080/api/users/0", {
      headers: {
        Authorization: newlyRegisteredUser.authToken,
      },
    })
    expect(getLoggedInUserDataResponse.status).toEqual(200)
    expect(await getLoggedInUserDataResponse.json()).toEqual<IUser>({
      id: 3,
      username: "andrew-smith",
      password: newlyRegisteredUser.hashedPassword,
    })
  })

  it("finds newly registered user by id", async () => {
    const findNewlyRegisteredUserByIdResponse = await fetch("http://localhost:3080/api/users/3", {
      headers: {
        Authorization: newlyRegisteredUser.authToken,
      },
    })
    expect(findNewlyRegisteredUserByIdResponse.status).toEqual(200)
    expect(await findNewlyRegisteredUserByIdResponse.json()).toEqual<IUser>({
      id: 3,
      username: "andrew-smith",
      password: newlyRegisteredUser.hashedPassword,
    })
  })

  it("users list includes newly registered user", async () => {
    const allUsersResponse = await fetch("http://localhost:3080/api/users/search", {
      headers: {
        Authorization: newlyRegisteredUser.authToken,
      },
    })
    expect(await allUsersResponse.json()).toEqual<IUser[]>([
      { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
      { id: 2, username: "jessica-stark", password: "$2b$10$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC" },
      { id: 3, username: "andrew-smith", password: newlyRegisteredUser.hashedPassword },
    ])
  })
})

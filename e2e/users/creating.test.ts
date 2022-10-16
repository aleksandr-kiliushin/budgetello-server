import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

describe("User creating process", () => {
  it("can create and get correct data response after creating", async () => {
    const responseBody = await fetchGqlApi(`mutation CREATE_USER {
      createUser(input: { username: "andrew-smith", password: "andrew-smith-password" }) {
        id,
        password,
        username
      }
    }`)
    expect(responseBody).toEqual({
      data: {
        createUser: {
          id: 3,
          password: expect.stringMatching(".+"),
          username: "andrew-smith",
        },
      },
    })
  })

  // it("validates user creating input", async () => {
  //   const response = await fetch("http://localhost:3080/api/users", {
  //     body: JSON.stringify({ username: "" }),
  //     headers: { "Content-Type": "application/json" },
  //     method: "POST",
  //   })
  //   expect(response.status).toEqual(400)
  //   expect(await response.json()).toEqual({
  //     fields: {
  //       username: "Required.",
  //       password: "Required.",
  //     },
  //   })
  // })
})

describe("Created user data and operations", () => {
  let newlyCreatedUser = {
    id: 0,
    username: "",
    password: "",
    hashedPassword: "",
    authToken: "",
  }

  beforeEach(async () => {
    const creatingUserResponseBody = await fetchGqlApi(`mutation CREATE_USER {
      createUser(input: { username: "andrew-smith", password: "andrew-smith-password" }) {
        id,
        password,
        username
      }
    }`)
    const newlyCreatedUserAuthorizationResponse = await fetch("http://localhost:3080/api/authorize", {
      body: JSON.stringify({ username: "andrew-smith", password: "andrew-smith-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    const { authToken } = await newlyCreatedUserAuthorizationResponse.json()
    newlyCreatedUser = {
      id: creatingUserResponseBody.id,
      username: creatingUserResponseBody.username,
      password: "andrew-smith-password",
      hashedPassword: creatingUserResponseBody.password,
      authToken,
    }
  })

  it("a newly created user requests their data", async () => {
    const response = await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `{
          user(id: 0) {
            id,
            password,
            username
          }
        }`,
      }),
      headers: {
        Accept: "application/json",
        Authorization: newlyCreatedUser.authToken,
        "Content-Type": "application/json",
      },
      method: "POST",
    })
    const responseBody = await response.json()
    expect(responseBody).toEqual({
      data: {
        user: {
          id: 3,
          password: expect.stringMatching(".+"),
          username: "andrew-smith",
        },
      },
    })
  })

  it("finds newly created user by id", async () => {
    await authorize(users.johnDoe)
    const responseBody = await fetchGqlApi(`{
      user(id: 3) {
        id,
        password,
        username
      }
    }`)
    expect(responseBody).toEqual({
      data: {
        user: {
          id: 3,
          password: expect.stringMatching(".+"),
          username: "andrew-smith",
        },
      },
    })
  })
})

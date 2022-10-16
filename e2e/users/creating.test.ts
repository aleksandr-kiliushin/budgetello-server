import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/pickFields"

describe("User creating process", () => {
  it("can create and get correct data response after creating", async () => {
    const responseBody = await fetchGqlApi(`mutation CREATE_USER {
      createUser(input: { username: "andrew-smith", password: "andrew-smith-password" }) {
        ${pickFields.user}
      }
    }`)
    expect(responseBody.data).toEqual({
      createUser: {
        id: 3,
        password: expect.stringMatching(".+"),
        username: "andrew-smith",
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
  beforeEach(async () => {
    await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `mutation CREATE_USER {
          createUser(input: { username: "andrew-smith", password: "andrew-smith-password" }) {
            ${pickFields.user}
          }
        }`,
      }),
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      method: "POST",
    })
  })

  it("created user authorizes and requests their data", async () => {
    const newlyCreatedUserAuthorizationResponse = await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `mutation AUTHORIZE {
          authorize(input: { username: "andrew-smith", password: "andrew-smith-password" })
        }`,
      }),
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      method: "POST",
    })
    const newlyCreatedUserAuthorizationResponseBody = await newlyCreatedUserAuthorizationResponse.json()
    const authorizationToken = newlyCreatedUserAuthorizationResponseBody.data.authorize
    const fetchAuthorizedUserDataResponse = await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `{
          user(id: 0) {
            ${pickFields.user}
          }
        }`,
      }),
      headers: { Accept: "application/json", Authorization: authorizationToken, "Content-Type": "application/json" },
      method: "POST",
    })
    const fetchAuthorizedUserDataResponseBody = await fetchAuthorizedUserDataResponse.json()
    expect(fetchAuthorizedUserDataResponseBody.data).toEqual({
      user: {
        id: 3,
        password: expect.stringMatching(".+"),
        username: "andrew-smith",
      },
    })
  })

  it("finds newly created user by ID", async () => {
    await authorize(users.johnDoe.id)
    const responseBody = await fetchGqlApi(`{
      user(id: 3) {
        ${pickFields.user}
      }
    }`)
    expect(responseBody.data).toEqual({
      user: {
        id: 3,
        password: expect.stringMatching(".+"),
        username: "andrew-smith",
      },
    })
  })
})

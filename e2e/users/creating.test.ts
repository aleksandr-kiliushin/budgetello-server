import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

describe("User creating process", () => {
  it("validates user creating input", async () => {
    const response = await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `mutation CREATE_USER {
          createUser(input: { username: "", password: "", passwordConfirmation: "" }) {
            ${pickFields.user}
          }
        }`,
      }),
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      method: "POST",
    })
    const responseBody = await response.json()
    expect(responseBody.errors[0].extensions.exception.response).toEqual({
      fields: {
        username: "Required.",
        password: "Required.",
        passwordConfirmation: "Required.",
      },
    })
  })

  it("validates the passwords match", async () => {
    const response = await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `mutation CREATE_USER {
          createUser(input: { username: "andrew-smith", password: "andrew-smith-password", passwordConfirmation: "ANOTHER_PASSWORD" }) {
            ${pickFields.user}
          }
        }`,
      }),
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      method: "POST",
    })
    const responseBody = await response.json()
    expect(responseBody.errors[0].extensions.exception.response).toEqual({
      fields: {
        password: "Passwords do not match.",
        passwordConfirmation: "Passwords do not match.",
      },
    })
  })

  it("does not allow to create a user if the username is already taken", async () => {
    const response = await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `mutation CREATE_USER {
          createUser(input: { username: "john-doe", password: "123", passwordConfirmation: "123" }) {
            ${pickFields.user}
          }
        }`,
      }),
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      method: "POST",
    })
    const responseBody = await response.json()
    expect(responseBody.errors[0].extensions.exception.response).toEqual({
      fields: {
        username: "Already exists.",
      },
    })
  })

  it("can create and get correct data response after creating", async () => {
    const response = await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `mutation CREATE_USER {
          createUser(input: { username: "andrew-smith", password: "andrew-smith-password", passwordConfirmation: "andrew-smith-password" }) {
            ${pickFields.user}
          }
        }`,
      }),
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      method: "POST",
    })
    const responseBody = await response.json()
    expect(responseBody.data).toEqual({
      createUser: {
        id: 3,
        password: expect.stringMatching(".+"),
        username: "andrew-smith",
      },
    })
  })
})

describe("Created user data and operations", () => {
  beforeEach(async () => {
    await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `mutation CREATE_USER {
          createUser(input: { username: "andrew-smith", password: "andrew-smith-password", passwordConfirmation: "andrew-smith-password" }) {
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
        query: `mutation CREATE_AUTHORIZATION_TOKEN {
          createAuthorizationToken(input: { username: "andrew-smith", password: "andrew-smith-password" })
        }`,
      }),
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      method: "POST",
    })
    const newlyCreatedUserAuthorizationResponseBody = await newlyCreatedUserAuthorizationResponse.json()
    const authorizationToken = newlyCreatedUserAuthorizationResponseBody.data.createAuthorizationToken
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

  it("finds created user by ID", async () => {
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

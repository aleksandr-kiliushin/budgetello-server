import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("User updating", () => {
  it("allows the logged in user to update themselves", async () => {
    const responseBody = await fetchGqlApi(`mutation UPDATE_USER {
      updateUser(input: { id: ${users.johnDoe.id}, username: "john-doe-is-cool", password: "john-doe-new-password" }) {
        id,
        password,
        username
      }
    }`)
    expect(responseBody).toEqual({
      data: {
        updateUser: {
          id: users.johnDoe.id,
          username: "john-doe-is-cool",
          password: expect.stringMatching(".+"),
        },
      },
    })
  })

  it("user can authorize with the new credentials", async () => {
    await fetchGqlApi(`mutation UPDATE_USER {
      updateUser(input: { id: ${users.johnDoe.id}, username: "john-doe-is-cool", password: "john-doe-new-password" }) {
        id,
        password,
        username
      }
    }`)
    const authorizeWithNewCredentialsResponse = await fetch("http://localhost:3080/api/authorize", {
      body: JSON.stringify({ username: "john-doe-is-cool", password: "john-doe-new-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    expect(authorizeWithNewCredentialsResponse.status).toEqual(201)
    expect(await authorizeWithNewCredentialsResponse.json()).toEqual({
      authorizationToken: expect.stringMatching(".+"),
    })
  })

  it("doesn't allow update another user", async () => {
    const responseBody = await fetchGqlApi(`mutation UPDATE_USER {
      updateUser(input: { id: ${users.jessicaStark.id}, username: "jessica-stark-is-stupid" }) {
        id,
        password,
        username
      }
    }`)
    expect(responseBody.errors[0].extensions.exception.response).toEqual({ message: "Access denied." })
    const fetchAnotherUserResponseBody = await fetchGqlApi(`{
      user(id: ${users.jessicaStark.id}) {
        id,
        password,
        username
      }
    }`)
    expect(fetchAnotherUserResponseBody).toEqual({ data: { user: users.jessicaStark } })
  })

  it("user cannot authorize with the old credentials", async () => {
    await fetchGqlApi(`mutation UPDATE_USER {
      updateUser(input: { id: ${users.johnDoe.id}, username: "john-doe-is-cool", password: "john-doe-new-password" }) {
        id,
        password,
        username
      }
    }`)
    const authWithTheOldCredentialsResponse = await fetch("http://localhost:3080/api/authorize", {
      body: JSON.stringify({ username: "john-doe", password: "john-doe-password" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
    expect(authWithTheOldCredentialsResponse.status).toEqual(400)
    expect(await authWithTheOldCredentialsResponse.json()).toEqual({ fields: { username: "User not found." } })
  })
})

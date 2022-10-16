import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("User updating", () => {
  it("allows the authorized user to update themselves", async () => {
    const responseBody = await fetchGqlApi(`mutation UPDATE_USER {
      updateUser(input: { id: ${users.johnDoe.id}, username: "john-doe-is-cool", password: "john-doe-new-password" }) {
        ${pickFields.user}
      }
    }`)
    expect(responseBody.data).toEqual({
      updateUser: {
        id: users.johnDoe.id,
        username: "john-doe-is-cool",
        password: expect.stringMatching(".+"),
      },
    })
  })

  it("authorization with the new credential is successful", async () => {
    await fetchGqlApi(`mutation UPDATE_USER {
      updateUser(input: { id: ${users.johnDoe.id}, username: "john-doe-is-cool", password: "john-doe-new-password" }) {
        ${pickFields.user}
      }
    }`)
    const response = await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `mutation AUTHORIZE {
          authorize(input: { username: "john-doe-is-cool", password: "john-doe-new-password" })
        }`,
      }),
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      method: "POST",
    })
    expect(response.status).toEqual(200)
    const responseBody = await response.json()
    expect(responseBody.data.authorize).toEqual(expect.stringMatching(".+"))
  })

  it("authorization with the old credential is failed", async () => {
    await fetchGqlApi(`mutation UPDATE_USER {
      updateUser(input: { id: ${users.johnDoe.id}, username: "john-doe-is-cool", password: "john-doe-new-password" }) {
        ${pickFields.user}
      }
    }`)
    const response = await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `mutation AUTHORIZE {
          authorize(input: { username: "john-doe", password: "john-doe-password" })
        }`,
      }),
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      method: "POST",
    })
    const responseBody = await response.json()
    expect(responseBody.errors[0].extensions.exception.response).toEqual({ fields: { username: "User not found." } })
  })

  it("updating another user is failed", async () => {
    const updateAnotherUserResponseBody = await fetchGqlApi(`mutation UPDATE_USER {
      updateUser(input: { id: ${users.jessicaStark.id}, username: "john-doe-is-cool", password: "john-doe-new-password" }) {
        ${pickFields.user}
      }
    }`)
    expect(updateAnotherUserResponseBody.errors[0].extensions.exception.response).toEqual({ message: "Access denied." })
    const fetchAnotherUserResponseBody = await fetchGqlApi(`{
      user(id: ${users.jessicaStark.id}) {
        ${pickFields.user}
      }
    }`)
    expect(fetchAnotherUserResponseBody.data.user).toEqual(users.jessicaStark)
  })
})

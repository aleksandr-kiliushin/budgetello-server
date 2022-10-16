import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("User deleting", () => {
  it("deleting another user failed", async () => {
    const responseBody = await fetchGqlApi(`mutation DELETE_USER {
      deleteUser(id: ${users.jessicaStark.id}) {
        ${QueryFields.user}
      }
    }`)
    expect(responseBody.errors[0].extensions.exception.response).toEqual({ message: "Access denied." })
    const fetchAnotherUserResponseBody = await fetchGqlApi(`{
      user(id: ${users.jessicaStark.id}) {
        ${QueryFields.user}
      }
    }`)
    expect(fetchAnotherUserResponseBody.data).toEqual({ user: users.jessicaStark })
  })

  it("authorized user deletes themselves successfully", async () => {
    const deleteMeResponseBody = await fetchGqlApi(`mutation DELETE_USER {
      deleteUser(id: ${users.johnDoe.id}) {
        ${QueryFields.user}
      }
    }`)
    expect(deleteMeResponseBody.data).toEqual({ deleteUser: users.johnDoe })
  })

  it("deleted user cannot be found by ID", async () => {
    await fetchGqlApi(`mutation DELETE_USER {
      deleteUser(id: ${users.johnDoe.id}) {
        ${QueryFields.user}
      }
    }`)
    await authorize(users.jessicaStark.id)
    const responseBody = await fetchGqlApi(`{
      user(id: ${users.johnDoe.id}) {
        ${QueryFields.user}
      }
    }`)
    expect(responseBody.errors[0].extensions.exception.response).toEqual({ message: "Not found." })
  })
})

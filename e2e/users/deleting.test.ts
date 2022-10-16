import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("User deletion", () => {
  it("doesn't allow delete another user", async () => {
    const deleteAnotherUserResponseBody = await fetchGqlApi(`mutation DELETE_USER {
      deleteUser(id: ${users.jessicaStark.id}) {
        id,
        password,
        username
      }
    }`)
    expect(deleteAnotherUserResponseBody.errors[0].extensions.exception.response).toEqual({ message: "Access denied." })
    const fetchAnotherUserResponseBody = await fetchGqlApi(`{
      user(id: ${users.jessicaStark.id}) {
        id,
        password,
        username
      }
    }`)
    expect(fetchAnotherUserResponseBody).toEqual({ data: { user: users.jessicaStark } })
  })

  it("allows the authorized user to delete themselves", async () => {
    const deleteMeResponseBody = await fetchGqlApi(`mutation DELETE_USER {
      deleteUser(id: ${users.johnDoe.id}) {
        id,
        password,
        username
      }
    }`)
    expect(deleteMeResponseBody).toEqual({ data: { deleteUser: users.johnDoe } })
  })

  it("deleted user cannot be found by ID", async () => {
    await fetchGqlApi(`mutation DELETE_USER {
      deleteUser(id: ${users.johnDoe.id}) {
        id,
        password,
        username
      }
    }`)
    await authorize(users.jessicaStark.username)
    const fetchDeletedUserResponseBody = await fetchGqlApi(`{
      user(id: ${users.johnDoe.id}) {
        id,
        password,
        username
      }
    }`)
    expect(fetchDeletedUserResponseBody.errors[0].extensions.exception.response).toEqual({ message: "Not found." })
  })
})

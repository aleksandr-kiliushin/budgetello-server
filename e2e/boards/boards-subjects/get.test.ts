import { boardSubjects } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("get boards subjects", () => {
  it("responds with all board subjects list", async () => {
    const response = await fetchGqlApi(`{
      boardSubjects {
        id,
        name
      }
    }`)
    expect(response).toEqual({
      data: {
        boardSubjects: [boardSubjects.budget, boardSubjects.activities],
      },
    })
  })

  it("responds with a board subject for a given id", async () => {
    const response = await fetchGqlApi(`{
      boardSubject(id: ${boardSubjects.activities.id}) {
        id,
        name
      }
    }`)
    expect(response).toEqual({
      data: {
        boardSubject: boardSubjects.activities,
      },
    })
  })
})

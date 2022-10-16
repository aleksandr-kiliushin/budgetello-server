import { boardSubjects } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("get boards subjects", () => {
  it("responds with all board subjects list", async () => {
    const response = await fetchGqlApi(`{
      boardSubjects {
        ${QueryFields.boardSubject}
      }
    }`)
    expect(response.data).toEqual({ boardSubjects: [boardSubjects.budget, boardSubjects.activities] })
  })

  it("responds with a board subject for a given ID", async () => {
    const response = await fetchGqlApi(`{
      boardSubject(id: ${boardSubjects.activities.id}) {
        ${QueryFields.boardSubject}
      }
    }`)
    expect(response.data).toEqual({ boardSubject: boardSubjects.activities })
  })
})

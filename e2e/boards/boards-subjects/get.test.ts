import { boardSubjects } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("get boards subjects", () => {
  it("responds with all board subjects list", async () => {
    const response = await fetchGqlApi(`{
      boardSubjects {
        ${pickFields.boardSubject}
      }
    }`)
    expect(response.data).toEqual({ boardSubjects: [boardSubjects.budget, boardSubjects.activities] })
  })

  it("responds with a board subject for a given ID", async () => {
    const response = await fetchGqlApi(`{
      boardSubject(id: ${boardSubjects.activities.id}) {
        ${pickFields.boardSubject}
      }
    }`)
    expect(response.data).toEqual({ boardSubject: boardSubjects.activities })
  })
})

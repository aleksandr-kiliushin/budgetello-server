import { BoardSubjectEntity } from "#models/board-subjects/entities/board-subject.entity"

import { boardsSubjects } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("get boards subjects", () => {
  it("responds with all board subjects list", async () => {
    const response = await fetchApi("/api/board-subjects")
    expect(await response.json()).toEqual<BoardSubjectEntity[]>([boardsSubjects.budget, boardsSubjects.activities])
  })

  it("responds with a board subject for a given id", async () => {
    const getBoardSubjectWithIdOf2Response = await fetchApi(`/api/board-subjects/${boardsSubjects.activities.id}`)
    expect(await getBoardSubjectWithIdOf2Response.json()).toEqual<BoardSubjectEntity>(boardsSubjects.activities)
  })
})

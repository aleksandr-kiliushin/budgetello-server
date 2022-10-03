import { BoardSubjectEntity } from "#models/board-subjects/entities/board-subject.entity"

import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("get boards subjects", () => {
  it("responds with all board subjects list", async () => {
    const fetchAllFinanceCategoryTypesResponse = await fetchApi("/api/board-subjects")
    expect(await fetchAllFinanceCategoryTypesResponse.json()).toEqual<BoardSubjectEntity[]>([
      { id: 1, name: "finances" },
      { id: 2, name: "habits" },
    ])
  })

  it("responds with a board subject for a given id", async () => {
    const getBoardSubjectWithIdOf2Response = await fetchApi("/api/board-subjects/2")
    expect(await getBoardSubjectWithIdOf2Response.json()).toEqual<BoardSubjectEntity>({ id: 2, name: "habits" })
  })
})

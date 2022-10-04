import { BoardEntity } from "#models/boards/entities/board.entity"

import { boardsSubjects } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("Board creating", () => {
  test.each<{
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
  }>([
    {
      payload: { name_WITH_A_TYPO: "food", subjectId: boardsSubjects.budgeting.id },
      response: { fields: { name: "Required field." } },
      status: 400,
    },
    {
      payload: { name: "", subjectId: boardsSubjects.budgeting.id },
      response: { fields: { name: "Required field." } },
      status: 400,
    },
    {
      payload: { name: "food", subjectId_WITH_A_TYPO: boardsSubjects.budgeting.id },
      response: { fields: { subjectId: "Required field." } },
      status: 400,
    },
    {
      payload: { name: "food", subjectId: 1234123 },
      response: { fields: { subjectId: "Invalid subject." } },
      status: 400,
    },
    {
      payload: { name: "clever-budgetiers", subjectId: boardsSubjects.budgeting.id },
      response: {
        fields: {
          name: '"clever-budgetiers" budgeting board already exists.',
          subjectId: '"clever-budgetiers" budgeting board already exists.',
        },
      },
      status: 400,
    },
    {
      payload: { name: "champions", subjectId: boardsSubjects.habits.id },
      response: {
        admins: [users.johnDoe],
        id: 4,
        members: [users.johnDoe],
        name: "champions",
        subject: boardsSubjects.habits,
      },
      status: 201,
    },
  ])("Board creating case #%#", async ({ payload, response, status }) => {
    const getNewlyCreatedBoardResponse = await fetchApi("/api/boards", {
      body: JSON.stringify(payload),
      method: "POST",
    })
    expect(getNewlyCreatedBoardResponse.status).toEqual(status)
    expect(await getNewlyCreatedBoardResponse.json()).toEqual(response)
  })

  it("a newly created board can be found by ID", async () => {
    await fetchApi("/api/boards", {
      body: JSON.stringify({ name: "champions", subjectId: boardsSubjects.habits.id }),
      method: "POST",
    })
    const getNewlyCreatedBoardResponse = await fetchApi("/api/boards/4")
    expect(await getNewlyCreatedBoardResponse.json()).toEqual<BoardEntity | unknown>({
      admins: [users.johnDoe],
      id: 4,
      members: [users.johnDoe],
      name: "champions",
      subject: boardsSubjects.habits,
    })
  })
})

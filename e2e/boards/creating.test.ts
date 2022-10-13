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
      payload: { name: "" },
      response: {
        fields: {
          name: '"Name" is not allowed to be empty',
          subjectId: '"Subject" is required',
        },
      },
      status: 400,
    },
    {
      payload: { name: "food", subjectId: 1234123 },
      response: { fields: { subjectId: "Invalid subject." } },
      status: 400,
    },
    {
      payload: { name: "clever-budgetiers", subjectId: boardsSubjects.budget.id },
      response: {
        fields: {
          name: '"clever-budgetiers" budget board already exists.',
          subjectId: '"clever-budgetiers" budget board already exists.',
        },
      },
      status: 400,
    },
    {
      payload: { name: "champions", subjectId: boardsSubjects.activities.id },
      response: {
        admins: [users.johnDoe],
        id: 5,
        members: [users.johnDoe],
        name: "champions",
        subject: boardsSubjects.activities,
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
      body: JSON.stringify({ name: "champions", subjectId: boardsSubjects.activities.id }),
      method: "POST",
    })
    const getNewlyCreatedBoardResponse = await fetchApi("/api/boards/5")
    expect(await getNewlyCreatedBoardResponse.json()).toEqual<BoardEntity | unknown>({
      admins: [users.johnDoe],
      id: 5,
      members: [users.johnDoe],
      name: "champions",
      subject: boardsSubjects.activities,
    })
  })
})

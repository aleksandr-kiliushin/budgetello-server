import { BoardEntity } from "#models/boards/entities/board.entity"

import { boardSubjects, boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUserId, authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Boards updating", () => {
  test.each<{
    authorizedUserId: ITestUserId
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
    url: string
  }>([
    {
      authorizedUserId: users.jessicaStark.id,
      payload: {},
      response: { message: "You are not allowed to to this action." },
      status: 403,
      url: `/api/boards/${boards.cleverBudgetiers.id}`,
    },
    {
      authorizedUserId: users.johnDoe.id,
      payload: { name: "" },
      response: { fields: { name: "Name cannot be empty." } },
      status: 400,
      url: `/api/boards/${boards.cleverBudgetiers.id}`,
    },
    {
      authorizedUserId: users.johnDoe.id,
      payload: { subjectId: 666666 },
      response: { fields: { subjectId: "Invalid board subject." } },
      status: 400,
      url: `/api/boards/${boards.cleverBudgetiers.id}`,
    },
    {
      authorizedUserId: users.johnDoe.id,
      payload: { name: boards.megaEconomists.name },
      response: {
        fields: {
          name: '"mega-economists" budget board already exists.',
          subjectId: '"mega-economists" budget board already exists.',
        },
      },
      status: 400,
      url: `/api/boards/${boards.cleverBudgetiers.id}`,
    },
    {
      authorizedUserId: users.johnDoe.id,
      payload: {},
      response: boards.cleverBudgetiers,
      status: 200,
      url: `/api/boards/${boards.cleverBudgetiers.id}`,
    },
    {
      authorizedUserId: users.johnDoe.id,
      payload: { name: "champions", subjectId: boardSubjects.activities.id },
      response: {
        admins: [users.johnDoe],
        id: boards.cleverBudgetiers.id,
        members: [users.johnDoe, users.jessicaStark],
        name: "champions",
        subject: boardSubjects.activities,
      },
      status: 200,
      url: `/api/boards/${boards.cleverBudgetiers.id}`,
    },
  ])("Board updating case #%#", async ({ authorizedUserId, payload, response, status, url }) => {
    await authorize(authorizedUserId)
    const boardUpdatingResponse = await fetchApi(url, { body: JSON.stringify(payload), method: "PATCH" })
    expect(boardUpdatingResponse.status).toEqual(status)
    expect(await boardUpdatingResponse.json()).toEqual(response)
  })

  it("updated boards can be found by ID", async () => {
    await authorize(users.johnDoe.id)
    await fetchApi(`/api/boards/${boards.cleverBudgetiers.id}`, {
      body: JSON.stringify({ name: "champions", subjectId: boardSubjects.activities.id }),
      method: "PATCH",
    })
    const response = await fetchApi(`/api/boards/${boards.cleverBudgetiers.id}`)
    expect(await response.json()).toEqual<BoardEntity | unknown>({
      admins: [users.johnDoe],
      id: boards.cleverBudgetiers.id,
      members: [users.johnDoe, users.jessicaStark],
      name: "champions",
      subject: boardSubjects.activities,
    })
  })
})

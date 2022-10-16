import { BoardEntity } from "#models/boards/entities/board.entity"

import { boardSubjects, boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUser, authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Boards updating", () => {
  test.each<{
    authorizedUser: ITestUser
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
    url: string
  }>([
    {
      authorizedUser: users.jessicaStark,
      payload: {},
      response: { message: "You are not allowed to to this action." },
      status: 403,
      url: `/api/boards/${boards.cleverBudgetiers.id}`,
    },
    {
      authorizedUser: users.johnDoe,
      payload: { name: "" },
      response: { fields: { name: "Name cannot be empty." } },
      status: 400,
      url: `/api/boards/${boards.cleverBudgetiers.id}`,
    },
    {
      authorizedUser: users.johnDoe,
      payload: { subjectId: 666666 },
      response: { fields: { subjectId: "Invalid board subject." } },
      status: 400,
      url: `/api/boards/${boards.cleverBudgetiers.id}`,
    },
    {
      authorizedUser: users.johnDoe,
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
      authorizedUser: users.johnDoe,
      payload: {},
      response: boards.cleverBudgetiers,
      status: 200,
      url: `/api/boards/${boards.cleverBudgetiers.id}`,
    },
    {
      authorizedUser: users.johnDoe,
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
  ])("Board updating case #%#", async ({ authorizedUser, payload, response, status, url }) => {
    await authorize(authorizedUser)
    const boardUpdatingResponse = await fetchApi(url, { body: JSON.stringify(payload), method: "PATCH" })
    expect(boardUpdatingResponse.status).toEqual(status)
    expect(await boardUpdatingResponse.json()).toEqual(response)
  })

  it("updated boards can be found by ID", async () => {
    await authorize(users.johnDoe)
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

import { boards, boardsSubjects } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUserUsername, authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Participating in a board", () => {
  test.each<{
    authorizedUserUsername: ITestUserUsername
    responseBody: Record<string, unknown>
    status: number
    url: string
  }>([
    {
      authorizedUserUsername: users.jessicaStark.username,
      responseBody: { message: "You are already a member of this board." },
      status: 400,
      url: `/api/boards/${boards.megaEconomists.id}/participating`,
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      responseBody: {
        admins: [users.jessicaStark],
        id: boards.beautifulSportsmen.id,
        members: [users.johnDoe, users.jessicaStark],
        name: boards.beautifulSportsmen.name,
        subject: boardsSubjects.activities,
      },
      status: 201,
      url: `/api/boards/${boards.beautifulSportsmen.id}/participating`,
    },
  ])("Board joining case #%#", async ({ authorizedUserUsername, responseBody, status, url }) => {
    await authorize(authorizedUserUsername)
    const response = await fetchApi(url, { method: "POST" })
    expect(response.status).toEqual(status)
    expect(await response.json()).toEqual(responseBody)
  })

  test.each<{
    authorizedUserUsername: ITestUserUsername
    responseBody: Record<string, unknown>
    status: number
    url: string
  }>([
    {
      authorizedUserUsername: users.johnDoe.username,
      responseBody: { message: "You can't leave this board because you are not it's member." },
      status: 400,
      url: `/api/boards/${boards.beautifulSportsmen.id}/participating`,
    },
    {
      authorizedUserUsername: users.jessicaStark.username,
      responseBody: {
        message: "You can't leave a board where you are the only admin. You can delete the board.",
      },
      status: 400,
      url: `/api/boards/${boards.beautifulSportsmen.id}/participating`,
    },
    {
      authorizedUserUsername: users.jessicaStark.username,
      responseBody: {
        admins: [users.johnDoe],
        id: boards.cleverBudgetiers.id,
        members: [users.johnDoe],
        name: boards.cleverBudgetiers.name,
        subject: boardsSubjects.budget,
      },
      status: 200,
      url: `/api/boards/${boards.cleverBudgetiers.id}/participating`,
    },
  ])("Board leaving case #%#", async ({ authorizedUserUsername, responseBody, status, url }) => {
    await authorize(authorizedUserUsername)
    const response = await fetchApi(url, { method: "DELETE" })
    expect(response.status).toEqual(status)
    expect(await response.json()).toEqual(responseBody)
  })
})

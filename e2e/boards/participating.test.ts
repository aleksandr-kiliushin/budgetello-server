import { boardSubjects, boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUserUsername, authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Participating in a board", () => {
  describe("Add user to a board", () => {
    test.each<{
      authorizedUserUsername: ITestUserUsername
      responseBody: Record<string, unknown>
      status: number
      url: string
    }>([
      {
        authorizedUserUsername: users.johnDoe.username,
        responseBody: { message: "Access denied." },
        status: 403,
        url: `/api/boards/${boards.beautifulSportsmen.id}/add-member/${users.jessicaStark.id}`,
      },
      {
        authorizedUserUsername: users.johnDoe.username,
        responseBody: { message: "The user is already a member of the board." },
        status: 400,
        url: `/api/boards/${boards.cleverBudgetiers.id}/add-member/${users.jessicaStark.id}`,
      },
      {
        authorizedUserUsername: users.jessicaStark.username,
        responseBody: {
          admins: [users.jessicaStark],
          id: boards.beautifulSportsmen.id,
          members: [users.johnDoe, users.jessicaStark],
          name: boards.beautifulSportsmen.name,
          subject: boardSubjects.activities,
        },
        status: 201,
        url: `/api/boards/${boards.beautifulSportsmen.id}/add-member/${users.johnDoe.id}`,
      },
    ])("case #%#", async ({ authorizedUserUsername, responseBody, status, url }) => {
      await authorize(authorizedUserUsername)
      const response = await fetchApi(url, { method: "POST" })
      expect(response.status).toEqual(status)
      expect(await response.json()).toEqual(responseBody)
    })
  })

  describe("Remove user from a board", () => {
    test.each<{
      authorizedUserUsername: ITestUserUsername
      responseBody: Record<string, unknown>
      status: number
      url: string
    }>([
      {
        authorizedUserUsername: users.johnDoe.username,
        responseBody: { message: "The user can't be removed from this board because they are the only admin." },
        status: 403,
        url: `/api/boards/${boards.productivePeople.id}/remove-member/${users.johnDoe.id}`,
      },
      {
        authorizedUserUsername: users.johnDoe.username,
        responseBody: { message: "Access denied." },
        status: 403,
        url: `/api/boards/${boards.beautifulSportsmen.id}/remove-member/${users.jessicaStark.id}`,
      },
      {
        authorizedUserUsername: users.jessicaStark.username,
        responseBody: { message: "Access denied." },
        status: 403,
        url: `/api/boards/${boards.productivePeople.id}/remove-member/${users.johnDoe.id}`,
      },
      {
        authorizedUserUsername: users.johnDoe.username,
        responseBody: {
          admins: [users.johnDoe],
          id: boards.productivePeople.id,
          members: [users.johnDoe],
          name: boards.productivePeople.name,
          subject: boardSubjects.activities,
        },
        status: 201,
        url: `/api/boards/${boards.productivePeople.id}/remove-member/${users.jessicaStark.id}`,
      },
    ])("case #%#", async ({ authorizedUserUsername, responseBody, status, url }) => {
      await authorize(authorizedUserUsername)
      const response = await fetchApi(url, { method: "POST" })
      expect(response.status).toEqual(status)
      expect(await response.json()).toEqual(responseBody)
    })
  })
})

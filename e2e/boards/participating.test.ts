import { boardsSubjects } from "#e2e/constants/boards"
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
      authorizedUserUsername: "jessica-stark",
      responseBody: { message: "You are already a member of this board." },
      status: 400,
      url: "/api/boards/2/participating",
    },
    {
      authorizedUserUsername: "john-doe",
      responseBody: {
        admins: [users.jessicaStark],
        id: 3,
        members: [users.jessicaStark, users.johnDoe],
        name: "beautiful-sportsmen",
        subject: boardsSubjects.habits,
      },
      status: 201,
      url: "/api/boards/3/participating",
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
      authorizedUserUsername: "john-doe",
      responseBody: { message: "You can't leave this board because you are not it's member." },
      status: 400,
      url: "/api/boards/3/participating",
    },
    {
      authorizedUserUsername: "jessica-stark",
      responseBody: {
        message: "You can't leave a board where you are the only admin. You can delete the board.",
      },
      status: 400,
      url: "/api/boards/3/participating",
    },
    {
      authorizedUserUsername: "jessica-stark",
      responseBody: {
        admins: [users.johnDoe],
        id: 1,
        members: [users.johnDoe],
        name: "clever-financiers",
        subject: boardsSubjects.finances,
      },
      status: 200,
      url: "/api/boards/1/participating",
    },
  ])("Board leaving case #%#", async ({ authorizedUserUsername, responseBody, status, url }) => {
    await authorize(authorizedUserUsername)
    const response = await fetchApi(url, { method: "DELETE" })
    expect(response.status).toEqual(status)
    expect(await response.json()).toEqual(responseBody)
  })
})

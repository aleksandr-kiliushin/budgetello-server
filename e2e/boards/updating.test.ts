import { BoardEntity } from "#models/boards/entities/board.entity"

import { boardsSubjects } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUserUsername, authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Boards updating", () => {
  test.each<{
    authorizedUserUsername: ITestUserUsername
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
    url: string
  }>([
    {
      authorizedUserUsername: "jessica-stark",
      payload: {},
      response: { message: "You are not allowed to to this action." },
      status: 403,
      url: "/api/boards/1",
    },
    {
      authorizedUserUsername: "john-doe",
      payload: { name: "" },
      response: { fields: { name: "Name cannot be empty." } },
      status: 400,
      url: "/api/boards/1",
    },
    {
      authorizedUserUsername: "john-doe",
      payload: { subjectId: 666666 },
      response: { fields: { subjectId: "Invalid board subject." } },
      status: 400,
      url: "/api/boards/1",
    },
    {
      authorizedUserUsername: "john-doe",
      payload: { name: "mega-economists" },
      response: {
        fields: {
          name: '"mega-economists" finances board already exists.',
          subjectId: '"mega-economists" finances board already exists.',
        },
      },
      status: 400,
      url: "/api/boards/1",
    },
    {
      authorizedUserUsername: "john-doe",
      payload: {},
      response: {
        admins: [users.johnDoe],
        id: 1,
        members: [users.johnDoe, users.jessicaStark],
        name: "clever-financiers",
        subject: boardsSubjects.finances,
      },
      status: 200,
      url: "/api/boards/1",
    },
    {
      authorizedUserUsername: "john-doe",
      payload: { name: "champions", subjectId: boardsSubjects.habits.id },
      response: {
        admins: [users.johnDoe],
        id: 1,
        members: [users.johnDoe, users.jessicaStark],
        name: "champions",
        subject: boardsSubjects.habits,
      },
      status: 200,
      url: "/api/boards/1",
    },
  ])("Board updating case #%#", async ({ authorizedUserUsername, payload, response, status, url }) => {
    await authorize(authorizedUserUsername)
    const boardUpdatingResponse = await fetchApi(url, { body: JSON.stringify(payload), method: "PATCH" })
    expect(boardUpdatingResponse.status).toEqual(status)
    expect(await boardUpdatingResponse.json()).toEqual(response)
  })

  it("updated boards can be found by ID", async () => {
    await authorize(users.johnDoe.username)
    await fetchApi("/api/boards/1", {
      body: JSON.stringify({ name: "champions", subjectId: boardsSubjects.habits.id }),
      method: "PATCH",
    })
    const response = await fetchApi("/api/boards/1")
    expect(await response.json()).toEqual<BoardEntity | unknown>({
      admins: [users.johnDoe],
      id: 1,
      members: [users.johnDoe, users.jessicaStark],
      name: "champions",
      subject: boardsSubjects.habits,
    })
  })
})

import { BoardEntity } from "#models/boards/entities/board.entity"

import { boardsSubjects } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Board deleting", () => {
  it("returns a correct response after deleting", async () => {
    await authorize(users.jessicaStark.username)
    const response = await fetchApi("/api/boards/1", { method: "DELETE" })
    expect(response.status).toEqual(403)
    expect(await response.json()).toEqual({ message: "You are not allowed to to this action." })
  })

  it("returns a correct response after deleting", async () => {
    await authorize(users.johnDoe.username)
    const response = await fetchApi("/api/boards/1", { method: "DELETE" })
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual<BoardEntity | unknown>({
      admins: [users.johnDoe],
      id: 1,
      name: "clever-financiers",
      subject: boardsSubjects.finances,
      members: [users.johnDoe, users.jessicaStark],
    })
  })

  it("the deleted board is not presented in all categories list", async () => {
    await authorize(users.johnDoe.username)
    await fetchApi("/api/boards/1", { method: "DELETE" })
    const response = await fetchApi("/api/boards/search")
    expect(await response.json()).toEqual<(BoardEntity | unknown)[]>([
      {
        admins: [users.jessicaStark],
        id: 2,
        name: "mega-economists",
        subject: boardsSubjects.finances,
        members: [users.jessicaStark],
      },
      {
        admins: [users.jessicaStark],
        id: 3,
        name: "beautiful-sportsmen",
        subject: boardsSubjects.habits,
        members: [users.jessicaStark],
      },
    ])
  })
})

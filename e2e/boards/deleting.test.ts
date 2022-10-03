import { BoardEntity } from "#models/boards/entities/board.entity"

import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Board deleting", () => {
  it("returns a correct response after deleting", async () => {
    await authorize("jessica-stark")
    const response = await fetchApi("/api/boards/1", { method: "DELETE" })
    expect(response.status).toEqual(403)
    expect(await response.json()).toEqual({ message: "You are not allowed to to this action." })
  })

  it("returns a correct response after deleting", async () => {
    await authorize("john-doe")
    const response = await fetchApi("/api/boards/1", { method: "DELETE" })
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual<BoardEntity | unknown>({
      admins: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
      id: 1,
      name: "clever-financiers",
      subject: { id: 1, name: "finances" },
      members: [
        { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
        { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
      ],
    })
  })

  it("the deleted board is not presented in all categories list", async () => {
    await authorize("john-doe")
    await fetchApi("/api/boards/1", { method: "DELETE" })
    const response = await fetchApi("/api/boards/search")
    expect(await response.json()).toEqual<(BoardEntity | unknown)[]>([
      {
        admins: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
        id: 2,
        name: "mega-economists",
        subject: { id: 1, name: "finances" },
        members: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
      },
      {
        admins: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
        id: 3,
        name: "beautiful-sportsmen",
        subject: { id: 2, name: "habits" },
        members: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
      },
    ])
  })
})

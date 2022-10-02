import { BoardEntity } from "../../src/models/boards/entities/board.entity"
import { authorize } from "../helpers/authorize"
import { fetchApi } from "../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Board creating", () => {
  test.each<{
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
  }>([
    {
      payload: { name_WITH_A_TYPO: "food", subjectId: 1 },
      response: { fields: { name: "Required field." } },
      status: 400,
    },
    {
      payload: { name: "", subjectId: 1 },
      response: { fields: { name: "Required field." } },
      status: 400,
    },
    {
      payload: { name: "food", subjectId_WITH_A_TYPO: 1 },
      response: { fields: { subjectId: "Required field." } },
      status: 400,
    },
    {
      payload: { name: "food", subjectId: 1234123 },
      response: { fields: { subjectId: "Invalid subject." } },
      status: 400,
    },
    {
      payload: { name: "clever-financiers", subjectId: 1 },
      response: {
        fields: {
          name: '"clever-financiers" finances board already exists.',
          subjectId: '"clever-financiers" finances board already exists.',
        },
      },
      status: 400,
    },
    {
      payload: { name: "champions", subjectId: 2 },
      response: {
        admins: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
        id: 4,
        members: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
        name: "champions",
        subject: { id: 2, name: "habits" },
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
    await fetchApi("/api/boards", { body: JSON.stringify({ name: "champions", subjectId: 2 }), method: "POST" })
    const getNewlyCreatedBoardResponse = await fetchApi("/api/boards/4")
    expect(await getNewlyCreatedBoardResponse.json()).toEqual<BoardEntity | unknown>({
      admins: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
      id: 4,
      members: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
      name: "champions",
      subject: { id: 2, name: "habits" },
    })
  })
})

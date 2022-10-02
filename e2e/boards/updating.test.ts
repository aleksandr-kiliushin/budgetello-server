import { BoardEntity } from "../../src/models/boards/entities/board.entity"
import { ITestUserUsername, authorize } from "../helpers/authorize"
import { fetchApi } from "../helpers/fetchApi"

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
        admins: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
        id: 1,
        members: [
          { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
          { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
        ],
        name: "clever-financiers",
        subject: { id: 1, name: "finances" },
      },
      status: 200,
      url: "/api/boards/1",
    },
    {
      authorizedUserUsername: "john-doe",
      payload: { name: "champions", subjectId: 2 },
      response: {
        admins: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
        id: 1,
        members: [
          { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
          { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
        ],
        name: "champions",
        subject: { id: 2, name: "habits" },
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
    await authorize("john-doe")
    await fetchApi("/api/boards/1", { body: JSON.stringify({ name: "champions", subjectId: 2 }), method: "PATCH" })
    const response = await fetchApi("/api/boards/1")
    expect(await response.json()).toEqual<BoardEntity | unknown>({
      admins: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
      id: 1,
      members: [
        { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
        { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
      ],
      name: "champions",
      subject: { id: 2, name: "habits" },
    })
  })
})

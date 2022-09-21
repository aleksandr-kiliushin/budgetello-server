import { GroupEntity } from "../../src/models/groups/entities/group.entity"
import { authorize } from "../helpers/authorize"
import { fetchApi } from "../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Groups updating", () => {
  test.each<{
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
    url: string
  }>([
    {
      payload: { name: "" },
      response: { fields: { name: "Name cannot be empty." } },
      status: 400,
      url: "/api/groups/1",
    },
    {
      payload: { subjectId: 666666 },
      response: { fields: { subjectId: "Invalid group subject." } },
      status: 400,
      url: "/api/groups/1",
    },
    {
      payload: { name: "beautiful-sportsmen", subjectId: 2 },
      response: {
        fields: {
          name: '"beautiful-sportsmen" habits group already exists.',
          subjectId: '"beautiful-sportsmen" habits group already exists.',
        },
      },
      status: 400,
      url: "/api/groups/1",
    },
    {
      payload: { name: "champions", subjectId: 2 },
      response: {
        id: 1,
        name: "champions",
        subject: { id: 2, name: "habits" },
        users: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
      },
      status: 200,
      url: "/api/groups/1",
    },
  ])("Group updating case #%#", async ({ payload, response, status, url }) => {
    const groupUpdatingResponse = await fetchApi(url, { body: JSON.stringify(payload), method: "PATCH" })
    expect(groupUpdatingResponse.status).toEqual(status)
    expect(await groupUpdatingResponse.json()).toEqual(response)
  })

  it("updated groups can be found by ID", async () => {
    await fetchApi("/api/groups/1", { body: JSON.stringify({ name: "champions", subjectId: 2 }), method: "PATCH" })
    const response = await fetchApi("/api/groups/1")
    expect(await response.json()).toEqual<GroupEntity | unknown>({
      id: 1,
      name: "champions",
      subject: { id: 2, name: "habits" },
      users: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
    })
  })
})

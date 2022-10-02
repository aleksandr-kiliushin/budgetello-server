import { GroupEntity } from "../../src/models/groups/entities/group.entity"
import { authorize } from "../helpers/authorize"
import { fetchApi } from "../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Group creating", () => {
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
          name: '"clever-financiers" finances group already exists.',
          subjectId: '"clever-financiers" finances group already exists.',
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
  ])("Group creating case #%#", async ({ payload, response, status }) => {
    const groupResponse = await fetchApi("/api/groups", { body: JSON.stringify(payload), method: "POST" })
    expect(groupResponse.status).toEqual(status)
    expect(await groupResponse.json()).toEqual(response)
  })

  it("a newly created group can be found by ID", async () => {
    await fetchApi("/api/groups", { body: JSON.stringify({ name: "champions", subjectId: 2 }), method: "POST" })
    const getNewlyGroupResponse = await fetchApi("/api/groups/4")
    expect(await getNewlyGroupResponse.json()).toEqual<GroupEntity | unknown>({
      admins: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
      id: 4,
      members: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
      name: "champions",
      subject: { id: 2, name: "habits" },
    })
  })
})

// import { GroupEntity } from "../../src/models/groups/entities/group.entity"
import { ITestUserUsername, authorize } from "../helpers/authorize"
import { fetchApi } from "../helpers/fetchApi"

describe("Participating in a group", () => {
  test.each<{
    authorizedUserUsername: ITestUserUsername
    responseBody: Record<string, unknown>
    status: number
    url: string
  }>([
    {
      authorizedUserUsername: "jessica-stark",
      responseBody: { message: "You are already a member of this group." },
      status: 400,
      url: "/api/groups/2/participating",
    },
    {
      authorizedUserUsername: "jessica-stark",
      responseBody: {
        admins: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
        id: 1,
        members: [
          { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
          { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
        ],
        name: "clever-financiers",
        subject: { id: 1, name: "finances" },
      },
      status: 201,
      url: "/api/groups/1/participating",
    },
  ])("Group joining case #%#", async ({ authorizedUserUsername, responseBody, status, url }) => {
    await authorize(authorizedUserUsername)
    const response = await fetchApi(url, { method: "POST" })
    expect(response.status).toEqual(status)
    expect(await response.json()).toEqual(responseBody)
  })

  // it("updated groups can be found by ID", async () => {
  //   await authorize("john-doe")
  //   await fetchApi("/api/groups/1", { body: JSON.stringify({ name: "champions", subjectId: 2 }), method: "PATCH" })
  //   const response = await fetchApi("/api/groups/1")
  // expect(await response.json()).toEqual<GroupEntity | unknown>({
  //   admins: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
  //   id: 1,
  //   members: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
  //   name: "champions",
  //   subject: { id: 2, name: "habits" },
  // })
  // })
})

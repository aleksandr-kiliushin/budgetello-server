import { GroupEntity } from "../../src/models/groups/entities/group.entity"
import { authorize } from "../helpers/authorize"
import { fetchApi } from "../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Responds with a group found by provided ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: GroupEntity | unknown }
    | { url: string; responseStatus: 404; responseData: Record<string, never> }
  >([
    {
      url: "/api/groups/1",
      responseStatus: 200,
      responseData: {
        id: 1,
        members: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
        name: "clever-financiers",
        subject: { id: 1, name: "finances" },
      },
    },
    {
      url: "/api/groups/666666",
      responseStatus: 404,
      responseData: {},
    },
  ])("group search for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Groups search", () => {
  test.each<{ url: string; searchResult: (GroupEntity | unknown)[] }>([
    {
      url: "/api/groups/search?id=1",
      searchResult: [
        {
          id: 1,
          members: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
          name: "clever-financiers",
          subject: { id: 1, name: "finances" },
        },
      ],
    },
    {
      url: "/api/groups/search?id=1,2",
      searchResult: [
        {
          id: 1,
          members: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
          name: "clever-financiers",
          subject: { id: 1, name: "finances" },
        },
        {
          id: 2,
          members: [
            { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
            { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
          ],
          name: "beautiful-sportsmen",
          subject: { id: 2, name: "habits" },
        },
      ],
    },
    {
      url: "/api/groups/search?id=666666",
      searchResult: [],
    },
    {
      url: "/api/groups/search",
      searchResult: [
        {
          id: 1,
          members: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
          name: "clever-financiers",
          subject: { id: 1, name: "finances" },
        },
        {
          id: 2,
          members: [
            { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
            { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
          ],
          name: "beautiful-sportsmen",
          subject: { id: 2, name: "habits" },
        },
      ],
    },
    {
      url: "/api/groups/search?subjectId=2",
      searchResult: [
        {
          id: 2,
          members: [
            { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
            { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
          ],
          name: "beautiful-sportsmen",
          subject: { id: 2, name: "habits" },
        },
      ],
    },
    {
      url: "/api/groups/search?name=finan",
      searchResult: [
        {
          id: 1,
          members: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
          name: "clever-financiers",
          subject: { id: 1, name: "finances" },
        },
      ],
    },
    {
      url: "/api/groups/search?name=finan&id=1&subjectId=1",
      searchResult: [
        {
          id: 1,
          members: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
          name: "clever-financiers",
          subject: { id: 1, name: "finances" },
        },
      ],
    },
  ])("groups search for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})

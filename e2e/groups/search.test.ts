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
        name: "clever-financiers",
        subject: { id: 1, name: "finances" },
        users: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
      },
    },
    {
      url: "/api/finances/categories/666666",
      responseStatus: 404,
      responseData: {},
    },
  ])("group search for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Finance categoires search", () => {
  test.each<{ url: string; searchResult: (GroupEntity | unknown)[] }>([
    {
      url: "/api/groups/search?id=1",
      searchResult: [
        {
          id: 1,
          name: "clever-financiers",
          subject: { id: 1, name: "finances" },
          users: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
        },
      ],
    },
    {
      url: "/api/groups/search?id=1,2",
      searchResult: [
        {
          id: 1,
          name: "clever-financiers",
          subject: { id: 1, name: "finances" },
          users: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
        },
        {
          id: 2,
          name: "beautiful-sportsmen",
          subject: { id: 2, name: "habits" },
          users: [
            { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
            { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
          ],
        },
      ],
    },
    // {
    //   url: "/api/finances/categories/search?id=666666",
    //   searchResult: [],
    // },
    // {
    //   url: "/api/finances/categories/search?id=66666,5",
    //   searchResult: [{ id: 5, name: "salary", type: { id: 2, name: "income" } }],
    // },
    // {
    //   url: "/api/finances/categories/search",
    //   searchResult: [
    //     { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
    //     { id: 2, name: "education", type: { id: 1, name: "expense" } },
    //     { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
    //     { id: 4, name: "gifts", type: { id: 2, name: "income" } },
    //     { id: 5, name: "salary", type: { id: 2, name: "income" } },
    //   ],
    // },
  ])("categories search for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})

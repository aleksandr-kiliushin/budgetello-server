import { BoardEntity } from "#models/boards/entities/board.entity"

import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Responds with a board found by provided ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: BoardEntity | unknown }
    | { url: string; responseStatus: 404; responseData: Record<string, never> }
  >([
    {
      url: "/api/boards/1",
      responseStatus: 200,
      responseData: {
        admins: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
        id: 1,
        members: [
          { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
          { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
        ],
        name: "clever-financiers",
        subject: { id: 1, name: "finances" },
      },
    },
    {
      url: "/api/boards/666666",
      responseStatus: 404,
      responseData: {},
    },
  ])("board search for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Boards search", () => {
  test.each<{ url: string; searchResult: (BoardEntity | unknown)[] }>([
    {
      url: "/api/boards/search?id=1",
      searchResult: [
        {
          admins: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
          id: 1,
          members: [
            { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
            { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
          ],
          name: "clever-financiers",
          subject: { id: 1, name: "finances" },
        },
      ],
    },
    {
      url: "/api/boards/search?id=1,3",
      searchResult: [
        {
          admins: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
          id: 1,
          members: [
            { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
            { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
          ],
          name: "clever-financiers",
          subject: { id: 1, name: "finances" },
        },
        {
          admins: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
          id: 3,
          members: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
          name: "beautiful-sportsmen",
          subject: { id: 2, name: "habits" },
        },
      ],
    },
    {
      url: "/api/boards/search?id=666666",
      searchResult: [],
    },
    {
      url: "/api/boards/search",
      searchResult: [
        {
          admins: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
          id: 1,
          members: [
            { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
            { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
          ],
          name: "clever-financiers",
          subject: { id: 1, name: "finances" },
        },
        {
          admins: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
          id: 2,
          members: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
          name: "mega-economists",
          subject: { id: 1, name: "finances" },
        },
        {
          admins: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
          id: 3,
          members: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
          name: "beautiful-sportsmen",
          subject: { id: 2, name: "habits" },
        },
      ],
    },
    {
      url: "/api/boards/search?subjectId=1",
      searchResult: [
        {
          admins: [{ id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" }],
          id: 1,
          members: [
            { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
            { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
          ],
          name: "clever-financiers",
          subject: { id: 1, name: "finances" },
        },
        {
          admins: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
          id: 2,
          members: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
          name: "mega-economists",
          subject: { id: 1, name: "finances" },
        },
      ],
    },
    {
      url: "/api/boards/search?name=me",
      searchResult: [
        {
          admins: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
          id: 2,
          members: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
          name: "mega-economists",
          subject: { id: 1, name: "finances" },
        },
        {
          admins: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
          id: 3,
          members: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
          name: "beautiful-sportsmen",
          subject: { id: 2, name: "habits" },
        },
      ],
    },
    {
      url: "/api/boards/search?name=me&subjectId=1&id=2",
      searchResult: [
        {
          admins: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
          id: 2,
          members: [{ id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" }],
          name: "mega-economists",
          subject: { id: 1, name: "finances" },
        },
      ],
    },
  ])("boards search for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})

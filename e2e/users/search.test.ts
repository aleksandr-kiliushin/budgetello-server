import { IUser } from "#interfaces/user"

import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Returns a user by their identifier", () => {
  test.each<
    | {
        url: string
        responseStatus: 200
        responseData: IUser
      }
    | {
        url: string
        responseStatus: 404
        responseData: Record<string, never>
      }
  >([
    {
      url: "/api/users/0",
      responseStatus: 200,
      responseData: {
        id: 1,
        username: "john-doe",
        password: "8bd309ffba83c3db9a53142b052468007b",
      },
    },
    {
      url: "/api/users/1",
      responseStatus: 200,
      responseData: {
        id: 1,
        username: "john-doe",
        password: "8bd309ffba83c3db9a53142b052468007b",
      },
    },
    {
      url: "/api/users/john-doe",
      responseStatus: 200,
      responseData: {
        id: 1,
        username: "john-doe",
        password: "8bd309ffba83c3db9a53142b052468007b",
      },
    },
    {
      url: "/api/users/john",
      responseStatus: 404,
      responseData: {},
    },
    {
      url: "/api/users/nonexistent-username",
      responseStatus: 404,
      responseData: {},
    },
    {
      url: "/api/users/123456789",
      responseStatus: 404,
      responseData: {},
    },
  ])("user search for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Users search", () => {
  test.each<{ url: string; searchResult: IUser[] }>([
    {
      url: "/api/users/search?id=1",
      searchResult: [
        {
          id: 1,
          username: "john-doe",
          password: "8bd309ffba83c3db9a53142b052468007b",
        },
      ],
    },
    {
      url: "/api/users/search?username=john-doe",
      searchResult: [
        {
          id: 1,
          username: "john-doe",
          password: "8bd309ffba83c3db9a53142b052468007b",
        },
      ],
    },
    {
      url: "/api/users/search?id=1&username=john-doe",
      searchResult: [
        {
          id: 1,
          username: "john-doe",
          password: "8bd309ffba83c3db9a53142b052468007b",
        },
      ],
    },
    {
      url: "/api/users/search?username=john",
      searchResult: [
        {
          id: 1,
          username: "john-doe",
          password: "8bd309ffba83c3db9a53142b052468007b",
        },
      ],
    },
    {
      url: "/api/users/search?username=doe",
      searchResult: [
        {
          id: 1,
          username: "john-doe",
          password: "8bd309ffba83c3db9a53142b052468007b",
        },
      ],
    },
    {
      url: "/api/users/search?username=doe",
      searchResult: [
        {
          id: 1,
          username: "john-doe",
          password: "8bd309ffba83c3db9a53142b052468007b",
        },
      ],
    },
    {
      url: "/api/users/search?username=j",
      searchResult: [
        {
          id: 1,
          username: "john-doe",
          password: "8bd309ffba83c3db9a53142b052468007b",
        },
        {
          id: 2,
          username: "jessica-stark",
          password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183",
        },
      ],
    },
    {
      url: "/api/users/search?username=nonexistent-username",
      searchResult: [],
    },
    {
      url: "/api/users/search?id=123456789",
      searchResult: [],
    },
    {
      url: "/api/users/search",
      searchResult: [
        {
          id: 1,
          username: "john-doe",
          password: "8bd309ffba83c3db9a53142b052468007b",
        },
        {
          id: 2,
          username: "jessica-stark",
          password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183",
        },
      ],
    },
  ])("user search for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})

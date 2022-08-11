import { IUser } from "../../src/interfaces/user"
import { authorize } from "../helpers/authorize"
import { fetchApi } from "../helpers/fetchApi"

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
        password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i",
      },
    },
    {
      url: "/api/users/1",
      responseStatus: 200,
      responseData: {
        id: 1,
        username: "john-doe",
        password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i",
      },
    },
    {
      url: "/api/users/john-doe",
      responseStatus: 200,
      responseData: {
        id: 1,
        username: "john-doe",
        password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i",
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
        { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
      ],
    },
    {
      url: "/api/users/search?username=john-doe",
      searchResult: [
        { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
      ],
    },
    {
      url: "/api/users/search?id=1&username=john-doe",
      searchResult: [
        { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
      ],
    },
    {
      url: "/api/users/search?username=john",
      searchResult: [
        { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
      ],
    },
    {
      url: "/api/users/search?username=doe",
      searchResult: [
        { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
      ],
    },
    {
      url: "/api/users/search?username=doe",
      searchResult: [
        { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
      ],
    },
    {
      url: "/api/users/search?username=j",
      searchResult: [
        { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
        { id: 2, username: "jessica-stark", password: "$2b$10$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC" },
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
        { id: 1, username: "john-doe", password: "$2b$10$h/JNwLghT1FZHjXWIPPO7OMBw5TKr3JExRhWZv4ERZ.YeDmgoBs0i" },
        { id: 2, username: "jessica-stark", password: "$2b$10$7IiBG7wqNoYzokw2ZOXF2uy1iHrDDaNge.de67g1n7TNTIY4iI6jC" },
      ],
    },
  ])("user search for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})

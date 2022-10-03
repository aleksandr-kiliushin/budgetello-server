import { IFinanceCategory } from "#interfaces/finance"

import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Responds with a finance category found by provided ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: IFinanceCategory }
    | { url: string; responseStatus: 403; responseData: Record<string, unknown> }
    | { url: string; responseStatus: 404; responseData: Record<string, never> }
  >([
    {
      url: "/api/finances/categories/1",
      responseStatus: 200,
      responseData: {
        board: { id: 1, name: "clever-financiers" },
        id: 1,
        name: "clothes",
        type: { id: 1, name: "expense" },
      },
    },
    {
      url: "/api/finances/categories/3",
      responseStatus: 403,
      responseData: { message: "Access denied." },
    },
    {
      url: "/api/finances/categories/666666",
      responseStatus: 404,
      responseData: {},
    },
  ])("category search for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Finance categoires search", () => {
  test.each<{ url: string; searchResult: IFinanceCategory[] }>([
    {
      url: "/api/finances/categories/search?id=1",
      searchResult: [
        { board: { id: 1, name: "clever-financiers" }, id: 1, name: "clothes", type: { id: 1, name: "expense" } },
      ],
    },
    {
      url: "/api/finances/categories/search?id=2,3",
      searchResult: [
        { board: { id: 1, name: "clever-financiers" }, id: 2, name: "education", type: { id: 1, name: "expense" } },
      ],
    },
    {
      url: "/api/finances/categories/search?id=5,666666",
      searchResult: [],
    },
    {
      url: "/api/finances/categories/search?boardId=1,2",
      searchResult: [
        { board: { id: 1, name: "clever-financiers" }, id: 1, name: "clothes", type: { id: 1, name: "expense" } },
        { board: { id: 1, name: "clever-financiers" }, id: 2, name: "education", type: { id: 1, name: "expense" } },
      ],
    },
    {
      url: "/api/finances/categories/search",
      searchResult: [
        { board: { id: 1, name: "clever-financiers" }, id: 1, name: "clothes", type: { id: 1, name: "expense" } },
        { board: { id: 1, name: "clever-financiers" }, id: 2, name: "education", type: { id: 1, name: "expense" } },
      ],
    },
  ])("categories search for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})

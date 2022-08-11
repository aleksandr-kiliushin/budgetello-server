import { IFinanceCategory } from "../../../src/interfaces/finance"
import { authorize } from "../../helpers/authorize"
import { fetchApi } from "../../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Responds with a finance category found by provided ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: IFinanceCategory }
    | { url: string; responseStatus: 404; responseData: Record<string, never> }
  >([
    {
      url: "/api/finances/categories/1",
      responseStatus: 200,
      responseData: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
    },
    {
      url: "/api/finances/categories/3",
      responseStatus: 200,
      responseData: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
    },
    {
      url: "/api/finances/categories/4",
      responseStatus: 200,
      responseData: { id: 4, name: "gifts", type: { id: 2, name: "income" } },
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
      searchResult: [{ id: 1, name: "clothes", type: { id: 1, name: "expense" } }],
    },
    {
      url: "/api/finances/categories/search?id=3,4",
      searchResult: [
        { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
        { id: 4, name: "gifts", type: { id: 2, name: "income" } },
      ],
    },
    {
      url: "/api/finances/categories/search?id=666666",
      searchResult: [],
    },
    {
      url: "/api/finances/categories/search?id=66666,5",
      searchResult: [{ id: 5, name: "salary", type: { id: 2, name: "income" } }],
    },
    {
      url: "/api/finances/categories/search",
      searchResult: [
        { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
        { id: 2, name: "education", type: { id: 1, name: "expense" } },
        { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
        { id: 4, name: "gifts", type: { id: 2, name: "income" } },
        { id: 5, name: "salary", type: { id: 2, name: "income" } },
      ],
    },
  ])("categories search for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})

import { IFinanceCategory } from "#interfaces/finance"

import { financeCategories } from "#e2e/constants/finances"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
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
      responseData: financeCategories.clothesExpense,
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
      url: `/api/finances/categories/search?id=${financeCategories.clothesExpense.id}`,
      searchResult: [financeCategories.clothesExpense],
    },
    {
      url: `/api/finances/categories/search?boardId=${financeCategories.clothesExpense.id},${financeCategories.educationExpense.id}`,
      searchResult: [financeCategories.clothesExpense, financeCategories.educationExpense],
    },
    {
      url: `/api/finances/categories/search?id=${financeCategories.educationExpense.id},${financeCategories.giftsExpense.id}`,
      searchResult: [financeCategories.educationExpense],
    },
    {
      url: `/api/finances/categories/search?id=${financeCategories.salaryIncome.id},666666`,
      searchResult: [],
    },
    {
      url: "/api/finances/categories/search",
      searchResult: [financeCategories.clothesExpense, financeCategories.educationExpense],
    },
  ])("categories search for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})

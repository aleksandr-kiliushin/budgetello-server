import { IBudgetCategory } from "#interfaces/budget"

import { budgetCategories } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("Responds with a budget category found by provided ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: IBudgetCategory }
    | { url: string; responseStatus: 403; responseData: Record<string, unknown> }
    | { url: string; responseStatus: 404; responseData: Record<string, never> }
  >([
    {
      url: "/api/budget/categories/1",
      responseStatus: 200,
      responseData: budgetCategories.clothesExpense,
    },
    {
      url: "/api/budget/categories/3",
      responseStatus: 403,
      responseData: { message: "Access denied." },
    },
    {
      url: "/api/budget/categories/666666",
      responseStatus: 404,
      responseData: {},
    },
  ])("category search for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Budget categoires search", () => {
  test.each<{ url: string; searchResult: IBudgetCategory[] }>([
    {
      url: `/api/budget/categories/search?id=${budgetCategories.clothesExpense.id}`,
      searchResult: [budgetCategories.clothesExpense],
    },
    {
      url: `/api/budget/categories/search?boardId=${budgetCategories.clothesExpense.id},${budgetCategories.educationExpense.id}`,
      searchResult: [budgetCategories.clothesExpense, budgetCategories.educationExpense],
    },
    {
      url: `/api/budget/categories/search?id=${budgetCategories.educationExpense.id},${budgetCategories.giftsExpense.id}`,
      searchResult: [budgetCategories.educationExpense],
    },
    {
      url: `/api/budget/categories/search?id=${budgetCategories.salaryIncome.id},666666`,
      searchResult: [],
    },
    {
      url: "/api/budget/categories/search",
      searchResult: [budgetCategories.clothesExpense, budgetCategories.educationExpense],
    },
  ])("categories search for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})

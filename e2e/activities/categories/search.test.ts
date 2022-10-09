import { IActivityCategory } from "#interfaces/activities"

import { activityCategories } from "#e2e/constants/activities"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.jessicaStark.username)
})

describe("Responds with a category found by provided ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: IActivityCategory }
    | { url: string; responseStatus: 403; responseData: Record<string, unknown> }
    | { url: string; responseStatus: 404; responseData: Record<string, never> }
  >([
    {
      url: "/api/activities/categories/1",
      responseStatus: 200,
      responseData: activityCategories.running,
    },
    {
      url: "/api/activities/categories/5",
      responseStatus: 403,
      responseData: { message: "Access denied." },
    },
    {
      url: "/api/activities/categories/666666",
      responseStatus: 404,
      responseData: {},
    },
  ])("category search for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

// describe("Budgeting categoires search", () => {
//   test.each<{ url: string; searchResult: IBudgetingCategory[] }>([
//     {
//       url: `/api/budgeting/categories/search?id=${budgetingCategories.clothesExpense.id}`,
//       searchResult: [budgetingCategories.clothesExpense],
//     },
//     {
//       url: `/api/budgeting/categories/search?boardId=${budgetingCategories.clothesExpense.id},${budgetingCategories.educationExpense.id}`,
//       searchResult: [budgetingCategories.clothesExpense, budgetingCategories.educationExpense],
//     },
//     {
//       url: `/api/budgeting/categories/search?id=${budgetingCategories.educationExpense.id},${budgetingCategories.giftsExpense.id}`,
//       searchResult: [budgetingCategories.educationExpense],
//     },
//     {
//       url: `/api/budgeting/categories/search?id=${budgetingCategories.salaryIncome.id},666666`,
//       searchResult: [],
//     },
//     {
//       url: "/api/budgeting/categories/search",
//       searchResult: [budgetingCategories.clothesExpense, budgetingCategories.educationExpense],
//     },
//   ])("categories search for: $url", async ({ url, searchResult }) => {
//     const response = await fetchApi(url)
//     expect(response.status).toEqual(200)
//     expect(await response.json()).toEqual(searchResult)
//   })
// })

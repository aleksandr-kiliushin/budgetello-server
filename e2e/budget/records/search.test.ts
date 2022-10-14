import { IBudgetRecord } from "#interfaces/budget"

import { boards } from "#e2e/constants/boards"
import { budgetCategories, budgetRecords } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("Get budget record by ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: IBudgetRecord }
    | { url: string; responseStatus: 403; responseData: { message: string } }
    | { url: string; responseStatus: 404; responseData: { message: string } }
  >([
    {
      url: `/api/budget/records/${budgetRecords["1st"].id}`,
      responseStatus: 200,
      responseData: budgetRecords["1st"],
    },
    {
      url: `/api/budget/records/${budgetRecords["4th"].id}`,
      responseStatus: 403,
      responseData: { message: "Access denied." },
    },
    {
      url: "/api/budget/records/666",
      responseStatus: 404,
      responseData: { message: "Record with ID '666' not found." },
    },
  ])("find record for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Budget records search", () => {
  test.each<{ url: string; responseBody: unknown; responseStatus: number }>([
    {
      url: "/api/budget/records/search",
      responseBody: [budgetRecords["3rd"], budgetRecords["2nd"], budgetRecords["1st"]],
      responseStatus: 200,
    },
    {
      url: `/api/budget/records/search?boardsIds=${boards.cleverBudgetiers.id},666666`,
      responseBody: [budgetRecords["3rd"], budgetRecords["2nd"], budgetRecords["1st"]],
      responseStatus: 200,
    },
    {
      url: "/api/budget/records/search?boardsIds=666666",
      responseBody: [],
      responseStatus: 200,
    },
    {
      url: `/api/budget/records/search?boardsIds=${boards.megaEconomists.id}`,
      responseBody: [],
      responseStatus: 200,
    },
    {
      url: `/api/budget/records/search?categoriesIds=${budgetCategories.educationExpense.id}`,
      responseBody: [budgetRecords["3rd"], budgetRecords["2nd"]],
      responseStatus: 200,
    },
    {
      url: `/api/budget/records/search?dates=2022-08-01`,
      responseBody: [budgetRecords["3rd"], budgetRecords["2nd"], budgetRecords["1st"]],
      responseStatus: 200,
    },
    {
      url: `/api/budget/records/search?amount=400`,
      responseBody: [budgetRecords["2nd"]],
      responseStatus: 200,
    },
    {
      url: `/api/budget/records/search?isTrashed=hehe`,
      responseBody: {
        query: {
          isTrashed: "Should be a boolean.",
        },
      },
      responseStatus: 400,
    },
    {
      url: "/api/budget/records/search?orderingByDate=ASC&orderingById=ASC&isTrashed=true&skip=1&take=1",
      responseBody: [budgetRecords["2nd"]],
      responseStatus: 200,
    },
  ])("find records for: $url", async ({ url, responseBody, responseStatus }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseBody)
  })
})

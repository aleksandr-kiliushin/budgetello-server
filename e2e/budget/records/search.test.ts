import { IBudgetRecord } from "#interfaces/budget"

import { boards } from "#e2e/constants/boards"
import { budgetRecords } from "#e2e/constants/budget"
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
  test.each<{ url: string; searchResult: IBudgetRecord[] }>([
    {
      url: "/api/budget/records/search",
      searchResult: [budgetRecords["3rd"], budgetRecords["2nd"], budgetRecords["1st"]],
    },
    {
      url: "/api/budget/records/search?boardId=1,666666",
      searchResult: [budgetRecords["3rd"], budgetRecords["2nd"], budgetRecords["1st"]],
    },
    {
      url: "/api/budget/records/search?boardId=666666",
      searchResult: [],
    },
    {
      url: `/api/budget/records/search?boardId=${boards.megaEconomists.id}`,
      searchResult: [],
    },
    {
      url: "/api/budget/records/search?orderingByDate=ASC&orderingById=ASC&isTrashed=true&skip=1&take=1",
      searchResult: [budgetRecords["2nd"]],
    },
  ])("find records for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})

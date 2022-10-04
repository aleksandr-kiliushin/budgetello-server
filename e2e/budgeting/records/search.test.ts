import { IBudgetingRecord } from "#interfaces/budgeting"

import { boards } from "#e2e/constants/boards"
import { budgetingRecords } from "#e2e/constants/budgeting"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("Get budgeting record by ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: IBudgetingRecord }
    | { url: string; responseStatus: 403; responseData: { message: string } }
    | { url: string; responseStatus: 404; responseData: { message: string } }
  >([
    {
      url: `/api/budgeting/records/${budgetingRecords["1st"].id}`,
      responseStatus: 200,
      responseData: budgetingRecords["1st"],
    },
    {
      url: `/api/budgeting/records/${budgetingRecords["4th"].id}`,
      responseStatus: 403,
      responseData: { message: "Access denied." },
    },
    {
      url: "/api/budgeting/records/666",
      responseStatus: 404,
      responseData: { message: "Record with ID '666' not found." },
    },
  ])("find record for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Budgeting records search", () => {
  test.each<{ url: string; searchResult: IBudgetingRecord[] }>([
    {
      url: "/api/budgeting/records/search",
      searchResult: [budgetingRecords["3rd"], budgetingRecords["2nd"], budgetingRecords["1st"]],
    },
    {
      url: "/api/budgeting/records/search?boardId=1,666666",
      searchResult: [budgetingRecords["3rd"], budgetingRecords["2nd"], budgetingRecords["1st"]],
    },
    {
      url: "/api/budgeting/records/search?boardId=666666",
      searchResult: [],
    },
    {
      url: `/api/budgeting/records/search?boardId=${boards.megaEconomists.id}`,
      searchResult: [],
    },
    {
      url: "/api/budgeting/records/search?orderingByDate=ASC&orderingById=ASC&isTrashed=true&skip=1&take=1",
      searchResult: [budgetingRecords["2nd"]],
    },
  ])("find records for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})

import { IFinanceRecord } from "#interfaces/finance"

import { boards } from "#e2e/constants/boards"
import { financeRecords } from "#e2e/constants/finances"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("Get finance record by ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: IFinanceRecord }
    | { url: string; responseStatus: 403; responseData: { message: string } }
    | { url: string; responseStatus: 404; responseData: { message: string } }
  >([
    {
      url: `/api/finances/records/${financeRecords["1st"].id}`,
      responseStatus: 200,
      responseData: financeRecords["1st"],
    },
    {
      url: `/api/finances/records/${financeRecords["4th"].id}`,
      responseStatus: 403,
      responseData: { message: "Access denied." },
    },
    {
      url: "/api/finances/records/666",
      responseStatus: 404,
      responseData: { message: "Record with ID '666' not found." },
    },
  ])("find record for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Finance records search", () => {
  test.each<{ url: string; searchResult: IFinanceRecord[] }>([
    {
      url: "/api/finances/records/search",
      searchResult: [financeRecords["3rd"], financeRecords["2nd"], financeRecords["1st"]],
    },
    {
      url: "/api/finances/records/search?boardId=1,666666",
      searchResult: [financeRecords["3rd"], financeRecords["2nd"], financeRecords["1st"]],
    },
    {
      url: "/api/finances/records/search?boardId=666666",
      searchResult: [],
    },
    {
      url: `/api/finances/records/search?boardId=${boards.megaEconomists.id}`,
      searchResult: [],
    },
    {
      url: "/api/finances/records/search?orderingByDate=ASC&orderingById=ASC&isTrashed=true&skip=1&take=1",
      searchResult: [financeRecords["2nd"]],
    },
  ])("find records for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})

import { IFinanceRecord } from "#interfaces/finance"

import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Finance record creating", () => {
  it("a newly created record is presented in all records list", async () => {
    await fetchApi("/api/finances/records", {
      body: JSON.stringify({ amount: 2000, categoryId: 1, date: "2022-08-05" }),
      method: "POST",
    })
    const getAllCategoriesResponse = await fetchApi("/api/finances/records/search")
    expect(await getAllCategoriesResponse.json()).toContainEqual<IFinanceRecord>({
      amount: 2000,
      category: {
        board: { id: 1, name: "clever-financiers" },
        id: 1,
        name: "clothes",
        type: { id: 1, name: "expense" },
      },
      date: "2022-08-05",
      id: 7,
      isTrashed: false,
    })
  })

  test.each<{
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
  }>([
    {
      payload: { amount: 0, categoryId: 1, date: "2022-08-05" },
      response: { fields: { amount: "Should be a positive number." } },
      status: 400,
    },
    {
      payload: { amount: 2000, categoryId_WITH_A_TYPO: 1, date: "2022-08-05" },
      response: { fields: { categoryId: "Required field." } },
      status: 400,
    },
    {
      payload: { amount: 2000, categoryId: 666666, date: "2022-08-05" },
      response: { fields: { categoryId: "Invalid category." } },
      status: 400,
    },
    {
      payload: { amount: 2000, categoryId: 1, date_WITH_A_TYPO: "2022-08-05" },
      response: { fields: { date: "Required field." } },
      status: 400,
    },
    {
      payload: { amount: 2000, categoryId: 1, date: "2022/08/05" },
      response: { fields: { date: "Should have format YYYY-MM-DD." } },
      status: 400,
    },
    {
      payload: { amount: 2000, categoryId: 1, date: "2022-08-05" },
      response: {
        amount: 2000,
        category: {
          board: { id: 1, name: "clever-financiers" },
          id: 1,
          name: "clothes",
          type: { id: 1, name: "expense" },
        },
        date: "2022-08-05",
        id: 7,
        isTrashed: false,
      },
      status: 201,
    },
  ])("Finance record creating case #%#", async ({ payload, response, status }) => {
    const recordCreatingResponse = await fetchApi("/api/finances/records", {
      body: JSON.stringify(payload),
      method: "POST",
    })
    expect(recordCreatingResponse.status).toEqual(status)
    expect(await recordCreatingResponse.json()).toEqual(response)
  })
})

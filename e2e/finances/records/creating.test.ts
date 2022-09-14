import { IFinanceRecord } from "../../../src/interfaces/finance"
import { authorize } from "../../helpers/authorize"
import { fetchApi } from "../../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Finance record creating", () => {
  it("a newly created record is presented in all records list", async () => {
    await fetchApi("/api/finances/records", {
      body: JSON.stringify({ amount: 2000, categoryId: 5, date: "2022-08-05" }),
      method: "POST",
    })
    const getAllCategoriesResponse = await fetchApi("/api/finances/records/search")
    expect(await getAllCategoriesResponse.json()).toContainEqual<IFinanceRecord>({
      amount: 2000,
      category: { id: 5, name: "salary", type: { id: 2, name: "income" } },
      date: "2022-08-05",
      id: 7,
      isTrashed: false,
    })
  })

  test.each<{
    payload: Record<string, string | number>
    response: Record<string, unknown>
    status: number
  }>([
    {
      payload: { amount: 0, categoryId: 5, date: "2022-08-05" },
      response: { fields: { amount: "Should be a positive number." } },
      status: 400,
    },
    {
      payload: { amount: 2000, categoryId_WITH_A_TYPO: 5, date: "2022-08-05" },
      response: { fields: { categoryId: "Required field." } },
      status: 400,
    },
    {
      payload: { amount: 2000, categoryId: 666666, date: "2022-08-05" },
      response: { fields: { categoryId: "Invalid category." } },
      status: 400,
    },
    {
      payload: { amount: 2000, categoryId: 5, date: "2022-08-05" },
      response: {
        amount: 2000,
        category: { id: 5, name: "salary", type: { id: 2, name: "income" } },
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

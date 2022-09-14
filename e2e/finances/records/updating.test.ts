import { authorize } from "../../helpers/authorize"
import { fetchApi } from "../../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

/* Initial record. */
// {
//   amount: 100,
//   category: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
//   date: "2022-08-01",
//   id: 1,
//   isTrashed: true,
// },

describe("Finance record updating", () => {
  test.each<{
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
  }>([
    {
      payload: { amount: 8000 },
      response: {
        amount: 8000,
        category: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
        date: "2022-08-01",
        id: 1,
        isTrashed: true,
      },
      status: 200,
    },
    {
      payload: { categoryId: 5 },
      response: {
        amount: 100,
        category: { id: 5, name: "salary", type: { id: 2, name: "income" } },
        date: "2022-08-01",
        id: 1,
        isTrashed: true,
      },
      status: 200,
    },
    {
      payload: { date: "2029-20-10" },
      response: {
        amount: 100,
        category: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
        date: "2029-20-10",
        id: 1,
        isTrashed: true,
      },
      status: 200,
    },
    {
      payload: { isTrashed: false },
      response: {
        amount: 100,
        category: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
        date: "2022-08-01",
        id: 1,
        isTrashed: false,
      },
      status: 200,
    },
    {
      payload: { amount: 90000, categoryId: 3, date: "2050-01-02", isTrashed: false },
      response: {
        amount: 90000,
        category: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
        date: "2050-01-02",
        id: 1,
        isTrashed: false,
      },
      status: 200,
    },
    {
      payload: {},
      response: {
        amount: 100,
        category: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
        date: "2022-08-01",
        id: 1,
        isTrashed: true,
      },
      status: 200,
    },
  ])("Finance record updating case #%#", async ({ payload, response, status }) => {
    const recordUpdatingResponse = await fetchApi("/api/finances/records/1", {
      body: JSON.stringify(payload),
      method: "PATCH",
    })
    expect(recordUpdatingResponse.status).toEqual(status)
    expect(await recordUpdatingResponse.json()).toEqual(response)
  })
})

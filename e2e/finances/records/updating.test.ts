import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

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
      payload: { amount: 0, categoryId: 1, date: "2022-08-05" },
      response: { fields: { amount: "Should be a positive number." } },
      status: 400,
    },
    {
      payload: { amount: 2000, categoryId: 666666, date: "2022-08-05" },
      response: { fields: { categoryId: "Invalid category." } },
      status: 400,
    },
    {
      payload: { date: "2022/08/05" },
      response: { fields: { date: "Should have format YYYY-MM-DD." } },
      status: 400,
    },
    {
      payload: { amount: 8000 },
      response: {
        amount: 8000,
        category: {
          board: { id: 1, name: "clever-financiers" },
          id: 1,
          name: "clothes",
          type: { id: 1, name: "expense" },
        },
        date: "2022-08-01",
        id: 1,
        isTrashed: true,
      },
      status: 200,
    },
    {
      payload: { categoryId: 2 },
      response: {
        amount: 100,
        category: {
          board: { id: 1, name: "clever-financiers" },
          id: 2,
          name: "education",
          type: { id: 1, name: "expense" },
        },
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
        category: {
          board: { id: 1, name: "clever-financiers" },
          id: 1,
          name: "clothes",
          type: { id: 1, name: "expense" },
        },
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
        category: {
          board: { id: 1, name: "clever-financiers" },
          id: 1,
          name: "clothes",
          type: { id: 1, name: "expense" },
        },
        date: "2022-08-01",
        id: 1,
        isTrashed: false,
      },
      status: 200,
    },
    {
      payload: { amount: 90000, categoryId: 2, date: "2050-01-02", isTrashed: false },
      response: {
        amount: 90000,
        category: {
          board: { id: 1, name: "clever-financiers" },
          id: 2,
          name: "education",
          type: { id: 1, name: "expense" },
        },
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
        category: {
          board: { id: 1, name: "clever-financiers" },
          id: 1,
          name: "clothes",
          type: { id: 1, name: "expense" },
        },
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

  test("the user cannot update a record of a board that they is not a member of", async () => {
    const recordUpdatingResponse = await fetchApi("/api/finances/records/5", {
      body: JSON.stringify({}),
      method: "PATCH",
    })
    expect(recordUpdatingResponse.status).toEqual(403)
    expect(await recordUpdatingResponse.json()).toEqual({ message: "Access denied." })
  })
})

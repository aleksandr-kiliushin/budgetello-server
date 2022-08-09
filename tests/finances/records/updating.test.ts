import { IFinanceRecord } from "../../../src/interfaces/finance"
import { UpdateFinanceRecordDto } from "../../../src/models/finance-record/dto/update-finance-record.dto"
import { logIn } from "../../helpers/logIn"

let authToken = ""
beforeEach(async () => {
  authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
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
  test.each<{ payload: UpdateFinanceRecordDto; updatedRecord: IFinanceRecord }>([
    {
      payload: { amount: 8000 },
      updatedRecord: {
        amount: 8000,
        category: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
        date: "2022-08-01",
        id: 1,
        isTrashed: true,
      },
    },
    {
      payload: { categoryId: 5 },
      updatedRecord: {
        amount: 100,
        category: { id: 5, name: "salary", type: { id: 2, name: "income" } },
        date: "2022-08-01",
        id: 1,
        isTrashed: true,
      },
    },
    {
      payload: { date: "2029-20-10" },
      updatedRecord: {
        amount: 100,
        category: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
        date: "2029-20-10",
        id: 1,
        isTrashed: true,
      },
    },
    {
      payload: { isTrashed: false },
      updatedRecord: {
        amount: 100,
        category: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
        date: "2022-08-01",
        id: 1,
        isTrashed: false,
      },
    },
    {
      payload: { amount: 90000, categoryId: 3, date: "2050-01-02", isTrashed: false },
      updatedRecord: {
        amount: 90000,
        category: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
        date: "2050-01-02",
        id: 1,
        isTrashed: false,
      },
    },
    {
      payload: {},
      updatedRecord: {
        amount: 100,
        category: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
        date: "2022-08-01",
        id: 1,
        isTrashed: true,
      },
    },
  ])("record updating", async ({ payload, updatedRecord }) => {
    const recordUpdatingResponse = await fetch("http://localhost:3080/api/finances/records/1", {
      body: JSON.stringify(payload),
      headers: { Authorization: authToken, "Content-Type": "application/json" },
      method: "PATCH",
    })
    // expect(recordUpdatingResponse.status).toEqual(200)
    expect(await recordUpdatingResponse.json()).toEqual(updatedRecord)
  })
})

import { IFinanceRecord } from "../../../src/interfaces/finance"
import { authorize } from "../../helpers/authorize"
import { fetchApi } from "../../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Finance record deleting", () => {
  it("returns a correct response after deleting", async () => {
    const recordDeletingResponse = await fetchApi("/api/finances/records/1", { method: "DELETE" })
    expect(recordDeletingResponse.status).toEqual(200)
    expect(await recordDeletingResponse.json()).toEqual<IFinanceRecord>({
      amount: 100,
      category: {
        group: { id: 1, name: "clever-financiers" },
        id: 1,
        name: "clothes",
        type: { id: 1, name: "expense" },
      },
      date: "2022-08-01",
      id: 1,
      isTrashed: true,
    })
  })

  it("the deleted records are not presented in all records list", async () => {
    await fetchApi("/api/finances/records/1", { method: "DELETE" })
    await fetchApi("/api/finances/records/2", { method: "DELETE" })
    await fetchApi("/api/finances/records/3", { method: "DELETE" })
    const getAllRecordsResponse = await fetchApi("/api/finances/records/search")
    expect(await getAllRecordsResponse.json()).toEqual<IFinanceRecord[]>([
      {
        amount: 230,
        category: {
          group: { id: 1, name: "clever-financiers" },
          id: 4,
          name: "gifts",
          type: { id: 2, name: "income" },
        },
        date: "2022-08-03",
        id: 6,
        isTrashed: false,
      },
      {
        amount: 10,
        category: {
          group: { id: 1, name: "clever-financiers" },
          id: 3,
          name: "gifts",
          type: { id: 1, name: "expense" },
        },
        date: "2022-08-02",
        id: 5,
        isTrashed: false,
      },
      {
        amount: 30,
        category: {
          group: { id: 1, name: "clever-financiers" },
          id: 3,
          name: "gifts",
          type: { id: 1, name: "expense" },
        },
        date: "2022-08-02",
        id: 4,
        isTrashed: false,
      },
    ])
  })
})

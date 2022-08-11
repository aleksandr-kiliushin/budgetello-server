import { IFinanceRecord } from "../../../src/interfaces/finance"
import { authorize } from "../../helpers/authorize"
import { fetchApi } from "../../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Finance record creating", () => {
  it("returns a correct response after creating", async () => {
    const recordCreatingResponse = await fetchApi("/api/finances/records", {
      body: JSON.stringify({ amount: 2000, categoryId: 5, date: "2022-08-05" }),
      method: "POST",
    })
    expect(recordCreatingResponse.status).toEqual(201)
    expect(await recordCreatingResponse.json()).toEqual<IFinanceRecord>({
      amount: 2000,
      category: { id: 5, name: "salary", type: { id: 2, name: "income" } },
      date: "2022-08-05",
      id: 7,
      isTrashed: false,
    })
  })

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

  it("a newly created record can be found by ID", async () => {
    await fetchApi("/api/finances/records", {
      body: JSON.stringify({ amount: 2000, categoryId: 5, date: "2022-08-05" }),
      method: "POST",
    })
    const getNewlyCreatedRecordResponse = await fetchApi("/api/finances/records/7")
    expect(await getNewlyCreatedRecordResponse.json()).toEqual<IFinanceRecord>({
      amount: 2000,
      category: { id: 5, name: "salary", type: { id: 2, name: "income" } },
      date: "2022-08-05",
      id: 7,
      isTrashed: false,
    })
  })
})

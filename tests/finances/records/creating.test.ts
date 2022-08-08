import { IFinanceRecord } from "../../../src/interfaces/finance"
import { logIn } from "../../helpers/logIn"

let authToken = ""
beforeEach(async () => {
  authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
})

describe("Finance record creating", () => {
  it("returns a correct response after creating", async () => {
    const recordCreatingResponse = await fetch("http://localhost:3080/api/finances/records", {
      body: JSON.stringify({ amount: 2000, categoryId: 5, date: "2022-08-05" }),
      headers: { Authorization: authToken, "Content-Type": "application/json" },
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
    await fetch("http://localhost:3080/api/finances/records", {
      body: JSON.stringify({ amount: 2000, categoryId: 5, date: "2022-08-05" }),
      headers: { Authorization: authToken, "Content-Type": "application/json" },
      method: "POST",
    })
    const getAllCategoriesResponse = await fetch("http://localhost:3080/api/finances/records/search", {
      headers: { Authorization: authToken },
    })
    expect(await getAllCategoriesResponse.json()).toContainEqual<IFinanceRecord>({
      amount: 2000,
      category: { id: 5, name: "salary", type: { id: 2, name: "income" } },
      date: "2022-08-05",
      id: 7,
      isTrashed: false,
    })
  })

  it("a newly created record can be found by ID", async () => {
    await fetch("http://localhost:3080/api/finances/records", {
      body: JSON.stringify({ amount: 2000, categoryId: 5, date: "2022-08-05" }),
      headers: { Authorization: authToken, "Content-Type": "application/json" },
      method: "POST",
    })
    const getNewlyCreatedRecordResponse = await fetch("http://localhost:3080/api/finances/records/7", {
      headers: { Authorization: authToken },
    })
    expect(await getNewlyCreatedRecordResponse.json()).toEqual<IFinanceRecord>({
      amount: 2000,
      category: { id: 5, name: "salary", type: { id: 2, name: "income" } },
      date: "2022-08-05",
      id: 7,
      isTrashed: false,
    })
  })
})

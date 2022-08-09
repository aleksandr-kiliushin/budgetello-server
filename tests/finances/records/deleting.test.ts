import { IFinanceRecord } from "../../../src/interfaces/finance"
import { logIn } from "../../helpers/logIn"

let authToken = ""
beforeEach(async () => {
  authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
})

describe("Finance record deleting", () => {
  it("returns a correct response after deleting", async () => {
    const recordDeletingResponse = await fetch("http://localhost:3080/api/finances/records/1", {
      headers: { Authorization: authToken },
      method: "DELETE",
    })
    expect(recordDeletingResponse.status).toEqual(200)
    expect(await recordDeletingResponse.json()).toEqual<IFinanceRecord>({
      amount: 100,
      category: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
      date: "2022-08-01",
      id: 1,
      isTrashed: true,
    })
  })

  it("the deleted records are not presented in all records list", async () => {
    await fetch("http://localhost:3080/api/finances/records/1", {
      headers: { Authorization: authToken },
      method: "DELETE",
    })
    await fetch("http://localhost:3080/api/finances/records/2", {
      headers: { Authorization: authToken },
      method: "DELETE",
    })
    await fetch("http://localhost:3080/api/finances/records/3", {
      headers: { Authorization: authToken },
      method: "DELETE",
    })
    const getAllRecordsResponse = await fetch("http://localhost:3080/api/finances/records/search", {
      headers: { Authorization: authToken },
    })
    expect(await getAllRecordsResponse.json()).toEqual<IFinanceRecord[]>([
      {
        amount: 230,
        category: { id: 4, name: "gifts", type: { id: 2, name: "income" } },
        date: "2022-08-03",
        id: 6,
        isTrashed: false,
      },
      {
        amount: 10,
        category: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
        date: "2022-08-02",
        id: 5,
        isTrashed: false,
      },
      {
        amount: 30,
        category: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
        date: "2022-08-02",
        id: 4,
        isTrashed: false,
      },
    ])
  })
})

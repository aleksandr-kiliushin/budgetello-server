import { IFinanceRecord } from "../../../src/interfaces/finance"
import { logIn } from "../../utils/logIn"

let authToken = ""
beforeEach(async () => {
  authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
})

describe("Search finance records", () => {
  it("responds with all finance records", async () => {
    const getAllFinanceRecordsResponse = await fetch("http://localhost:3080/api/finances/records/search", {
      headers: { Authorization: authToken },
    })
    expect(await getAllFinanceRecordsResponse.json()).toEqual<IFinanceRecord[]>([
      {
        amount: 100,
        category: { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
        date: "2022-08-01",
        id: 1,
        isTrashed: true,
      },
      {
        amount: 400,
        category: { id: 2, name: "education", type: { id: 1, name: "expense" } },
        date: "2022-08-01",
        id: 2,
        isTrashed: true,
      },
      {
        amount: 25,
        category: { id: 2, name: "education", type: { id: 1, name: "expense" } },
        date: "2022-08-01",
        id: 3,
        isTrashed: false,
      },
      {
        amount: 30,
        category: { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
        date: "2022-08-02",
        id: 4,
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
        amount: 230,
        category: { id: 4, name: "gifts", type: { id: 2, name: "income" } },
        date: "2022-08-03",
        id: 6,
        isTrashed: false,
      },
    ])
  })
})

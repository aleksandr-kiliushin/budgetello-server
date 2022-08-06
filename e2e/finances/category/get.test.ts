import { IFinanceCategory } from "../../../src/interfaces/finance"
import { logIn } from "../../utils/logIn"

let authToken = ""
beforeEach(async () => {
  authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
})

describe("get finance categories", () => {
  it.skip("responds with all finance categories", async () => {
    const getAllFinanceCategoriesResponse = await fetch("http://localhost:3080/finances/categories", {
      headers: { Authorization: "Bearer " + authToken },
    })
    expect(await getAllFinanceCategoriesResponse.json()).toEqual<IFinanceCategory[]>([
      { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
      { id: 2, name: "education", type: { id: 1, name: "expense" } },
      { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
      { id: 4, name: "gifts", type: { id: 2, name: "income" } },
      { id: 5, name: "salary", type: { id: 2, name: "income" } },
    ])
  })
})

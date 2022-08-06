import { IFinanceCategory } from "../../../src/interfaces/finance"
import { logIn } from "../../utils/logIn"

let authToken = ""
beforeEach(async () => {
  authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
})

describe("Finance category deleting", () => {
  it("returns a correct response after deleting", async () => {
    const categoryCreatingResponse = await fetch("http://localhost:3080/api/finances/categories/2", {
      headers: { Authorization: authToken },
      method: "DELETE",
    })
    expect(categoryCreatingResponse.status).toEqual(200)
    expect(await categoryCreatingResponse.json()).toEqual<IFinanceCategory>({
      id: 2,
      name: "education",
      type: { id: 1, name: "expense" },
    })
  })

  it("the deleted category is not presented in all categories list", async () => {
    await fetch("http://localhost:3080/api/finances/categories/2", {
      headers: { Authorization: authToken },
      method: "DELETE",
    })
    const getAllCategoriesResponse = await fetch("http://localhost:3080/api/finances/categories/search", {
      headers: { Authorization: authToken },
    })
    expect(await getAllCategoriesResponse.json()).toEqual<IFinanceCategory[]>([
      { id: 1, name: "clothes", type: { id: 1, name: "expense" } },
      { id: 3, name: "gifts", type: { id: 1, name: "expense" } },
      { id: 4, name: "gifts", type: { id: 2, name: "income" } },
      { id: 5, name: "salary", type: { id: 2, name: "income" } },
    ])
  })
})

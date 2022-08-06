import { IFinanceCategory } from "../../../src/interfaces/finance"
import { logIn } from "../../utils/logIn"

let authToken = ""
beforeEach(async () => {
  authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
})

describe("Finance category updating", () => {
  it("returns a correct response after updating", async () => {
    const categoryUpdatingResponse = await fetch("http://localhost:3080/api/finances/categories/2", {
      body: JSON.stringify({ name: "teaching", typeId: 2 }),
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      method: "PATCH",
    })
    expect(categoryUpdatingResponse.status).toEqual(200)
    expect(await categoryUpdatingResponse.json()).toEqual<IFinanceCategory>({
      id: 2,
      name: "teaching",
      type: { id: 2, name: "income" },
    })
  })

  it("a newly created category is presented in all categories list", async () => {
    await fetch("http://localhost:3080/api/finances/categories/2", {
      body: JSON.stringify({ name: "drugs" }),
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      method: "PATCH",
    })
    const getAllCategoriesResponse = await fetch("http://localhost:3080/api/finances/categories/search", {
      headers: { Authorization: authToken },
    })
    expect(await getAllCategoriesResponse.json()).toContainEqual<IFinanceCategory>({
      id: 2,
      name: "drugs",
      type: { id: 1, name: "expense" },
    })
  })

  it("a newly created category can be found by id", async () => {
    await fetch("http://localhost:3080/api/finances/categories/2", {
      body: JSON.stringify({ typeId: 2 }),
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      method: "PATCH",
    })
    const getAllCategoriesResponse = await fetch("http://localhost:3080/api/finances/categories/2", {
      headers: { Authorization: authToken },
    })
    expect(await getAllCategoriesResponse.json()).toEqual<IFinanceCategory>({
      id: 2,
      name: "education",
      type: { id: 2, name: "income" },
    })
  })
})

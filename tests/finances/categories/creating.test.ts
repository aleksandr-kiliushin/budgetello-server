import { IFinanceCategory } from "../../../src/interfaces/finance"
import { logIn } from "../../helpers/logIn"

let authToken = ""
beforeEach(async () => {
  authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
})

describe("Finance category creating", () => {
  it("returns a correct response after creating", async () => {
    const categoryCreatingResponse = await fetch("http://localhost:3080/api/finances/categories", {
      body: JSON.stringify({ name: "food", typeId: 1 }),
      headers: { Authorization: authToken, "Content-Type": "application/json" },
      method: "POST",
    })
    expect(categoryCreatingResponse.status).toEqual(201)
    expect(await categoryCreatingResponse.json()).toEqual<IFinanceCategory>({
      id: 6,
      name: "food",
      type: { id: 1, name: "expense" },
    })
  })

  it("a newly created category is presented in all categories list", async () => {
    await fetch("http://localhost:3080/api/finances/categories", {
      body: JSON.stringify({ name: "food", typeId: 1 }),
      headers: { Authorization: authToken, "Content-Type": "application/json" },
      method: "POST",
    })
    const getAllCategoriesResponse = await fetch("http://localhost:3080/api/finances/categories/search", {
      headers: { Authorization: authToken },
    })
    expect(await getAllCategoriesResponse.json()).toContainEqual<IFinanceCategory>({
      id: 6,
      name: "food",
      type: { id: 1, name: "expense" },
    })
  })

  it("a newly created category can be found by ID", async () => {
    await fetch("http://localhost:3080/api/finances/categories", {
      body: JSON.stringify({ name: "food", typeId: 1 }),
      headers: { Authorization: authToken, "Content-Type": "application/json" },
      method: "POST",
    })
    const getNewlyCreatedCategoryResponse = await fetch("http://localhost:3080/api/finances/categories/6", {
      headers: { Authorization: authToken },
    })
    expect(await getNewlyCreatedCategoryResponse.json()).toEqual<IFinanceCategory>({
      id: 6,
      name: "food",
      type: { id: 1, name: "expense" },
    })
  })

  it("returns an informative response if required fields not presented in request body", async () => {
    const categoryCreatingResponse = await fetch("http://localhost:3080/api/finances/categories", {
      body: JSON.stringify({
        name_WITH_A_TYPO: "food", // Incorrect field name.
        typeId: 1,
      }),
      headers: { Authorization: authToken, "Content-Type": "application/json" },
      method: "POST",
    })
    expect(categoryCreatingResponse.status).toEqual(400)
    expect(await categoryCreatingResponse.json()).toEqual({
      message: "Field 'name' should be provided.",
    })
  })
})

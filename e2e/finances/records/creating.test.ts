import { IFinanceRecord } from "../../../src/interfaces/finance"
import { logIn } from "../../utils/logIn"

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
      category: {
        id: 5,
        name: "salary",
        type: { id: 2, name: "income" },
      },
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
      category: {
        id: 5,
        name: "salary",
        type: { id: 2, name: "income" },
      },
      date: "2022-08-05",
      id: 7,
      isTrashed: false,
    })
  })

  // it("a newly created category can be found by id", async () => {
  //   await fetch("http://localhost:3080/api/finances/categories", {
  //     body: JSON.stringify({ name: "food", typeId: 1 }),
  //     headers: {
  //       Authorization: authToken,
  //       "Content-Type": "application/json",
  //     },
  //     method: "POST",
  //   })
  //   const getAllCategoriesResponse = await fetch("http://localhost:3080/api/finances/categories/6", {
  //     headers: { Authorization: authToken },
  //   })
  //   expect(await getAllCategoriesResponse.json()).toEqual<IFinanceCategory>({
  //     id: 6,
  //     name: "food",
  //     type: { id: 1, name: "expense" },
  //   })
  // })

  // it("returns an informative response if required fields not presented in request body", async () => {
  //   const categoryCreatingResponse = await fetch("http://localhost:3080/api/finances/categories", {
  //     body: JSON.stringify({
  //       name_WITH_A_TYPO: "food", // Incorrect field name.
  //       typeId: 1,
  //     }),
  //     headers: {
  //       Authorization: authToken,
  //       "Content-Type": "application/json",
  //     },
  //     method: "POST",
  //   })
  //   expect(categoryCreatingResponse.status).toEqual(400)
  //   expect(await categoryCreatingResponse.json()).toEqual({
  //     message: "Field 'name' should be provided.",
  //   })
  // })
})

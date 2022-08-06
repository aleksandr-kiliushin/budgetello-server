import { IFinanceCategoryType } from "../../../src/interfaces/finance"
import { logIn } from "../../utils/logIn"

describe("finance-category-types", () => {
  it("responds with all finance category types list", async () => {
    const authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
    const fetchAllFinanceCategoryTypesResponse = await fetch("http://localhost:3080/api/finances/category-type", {
      headers: { Authorization: "Bearer " + authToken },
    })
    expect(await fetchAllFinanceCategoryTypesResponse.json()).toEqual<IFinanceCategoryType[]>([
      { id: 1, name: "expense" },
      { id: 2, name: "income" },
    ])
  })
})
